import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(
    filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search.toLowerCase()}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException();
      this.logger.error(
        `Failed to get tasks for the user "${user.username}". Filters:"${filterDto}`,
        error.stack,
      );
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.DONE,
      user,
    });

    await this.save(task);
    return task;
  }
}
