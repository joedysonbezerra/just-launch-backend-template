import { BaseDTO } from '@kernelsoftware/shared';
import { IsOptional, IsString } from 'class-validator';

class RequestToUpdateUsersDTO extends BaseDTO {
  @IsString()
  id: string;

  @IsOptional()
  isConfirmed?: boolean;
}
export { RequestToUpdateUsersDTO };
