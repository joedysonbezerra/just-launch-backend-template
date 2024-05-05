import { BaseDTO } from '@kernelsoftware/shared';
import { IsNotEmpty, IsString } from 'class-validator';

class RequestToFindUserByTenantIdDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export { RequestToFindUserByTenantIdDTO };
