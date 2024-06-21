import { BaseDTO } from '@kernelsoftware/shared';
import { IsNotEmpty, IsString } from 'class-validator';

class RequestToDeleteExampleDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export { RequestToDeleteExampleDTO };
