import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import ShortUniqueId from 'short-unique-id';
import { PrismaService } from '~/prisma/prisma.service';
import { UrlDtoResponse } from './dto/url.dto.response';

@Injectable()
export class UrlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generate(url: string): Promise<UrlDtoResponse> {
    const baseUrl = this.config.get('BASE_URL');
    const hash = new ShortUniqueId().randomUUID(6);
    const shortUrl = `${baseUrl}/${hash}/redirect`;

    try {
      const urlRedirect = await this.prisma.url.create({
        data: {
          url,
          hash,
          shortUrl,
        },
        select: {
          shortUrl: true,
        },
      });

      return urlRedirect;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Url already exists');
        }
      }

      throw error;
    }
  }

  async get(hash: string) {
    const urlDb = await this.prisma.url.findUnique({ where: { hash } });

    return {
      originalUrl: urlDb.url,
    };
  }
}
