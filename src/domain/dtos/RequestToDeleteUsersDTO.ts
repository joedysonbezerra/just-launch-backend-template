import { BaseDTO } from '@kernelsoftware/shared';
import { IsNotEmpty, IsString } from 'class-validator';

class RequestToDeleteUsersDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export { RequestToDeleteUsersDTO };
