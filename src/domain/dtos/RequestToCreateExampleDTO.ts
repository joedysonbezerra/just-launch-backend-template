import { BaseDTO } from '@kernelsoftware/shared';
import { IsNotEmpty, IsString } from 'class-validator';

class RequestToUpsertExampleDTO extends BaseDTO {
  @IsNotEmpty()
  @IsString()
  text: string;
}
export { RequestToUpsertExampleDTO };
