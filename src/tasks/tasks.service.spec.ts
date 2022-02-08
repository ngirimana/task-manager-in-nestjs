import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});
const mockUser = {
  username: 'safari',
  id: 'someId',
  password: 'somePassword@1',
  tasks: [],
};
describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;
  beforeEach(async () => {
    // initialize a NestJs module with tasksService and TaskRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });
  describe('getAll', () => {
    it('Calls TasksRepository.getTask and return results', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });
});
