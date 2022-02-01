import { CreateTaskDto } from './dto/create-task-dto';
import { Injectable, Patch } from '@nestjs/common';
import { Task, TaskStatus } from '../tasks/task.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }
  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLocaleLowerCase().includes(search) ||
          task.description.toLocaleLowerCase().includes(search)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    return tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.tasks.find((task) => task.id === id);
    task.status = status;
    return task;
  }
}
