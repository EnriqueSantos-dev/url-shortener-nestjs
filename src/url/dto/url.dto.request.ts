import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UrlDtoRequest {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
