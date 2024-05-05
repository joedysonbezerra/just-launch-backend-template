import { BaseDTO } from '@kernelsoftware/shared';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class RequestToCreateUsersDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  source?: string;
}
export { RequestToCreateUsersDTO };
