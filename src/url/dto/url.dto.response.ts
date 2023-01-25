import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UrlDtoResponse {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  shortUrl: string;
}
