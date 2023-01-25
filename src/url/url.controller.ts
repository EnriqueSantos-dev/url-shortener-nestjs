import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDtoRequest } from './dto/url.dto.request';
import { Response } from 'express';
import { UrlDtoResponse } from './dto/url.dto.response';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('generate')
  async generate(@Body() body: UrlDtoRequest): Promise<UrlDtoResponse> {
    const { url } = body;
    const shortUrl = await this.urlService.generate(url);

    return shortUrl;
  }

  @Get(':hash/redirect')
  async redirect(
    @Param() params: { hash: string },
    @Res() res: Response,
  ): Promise<void> {
    const { hash } = params;
    const { originalUrl } = await this.urlService.get(hash);

    if (!originalUrl) throw new ForbiddenException('Url not found');

    return res.redirect(originalUrl);
  }
}
