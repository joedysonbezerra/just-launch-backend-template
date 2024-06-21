import { BaseDTO } from '@kernelsoftware/shared';
import { IsNotEmpty, IsString } from 'class-validator';

class RequestToFindExampleByIdDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export { RequestToFindExampleByIdDTO };
