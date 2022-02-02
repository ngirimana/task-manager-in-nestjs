import { IsNotEmpty } from 'class-validator';
import { title } from 'process';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}
