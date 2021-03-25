import { IsNotEmpty, IsString } from 'class-validator';

export class IdDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
