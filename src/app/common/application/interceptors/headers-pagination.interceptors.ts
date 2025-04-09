import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

export type PagingResult = {
  data: any[];
  count: number;
  page: number;
  limit: number;
};

@Injectable()
export class HeadersPaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ data, count, page, limit }: PagingResult) => {
        const response = context.switchToHttp().getResponse();
        const route = `${configService.get('API_HOST')}${response.req.originalUrl}`;

        const { paging, links } = this.paginate({ count, page, limit, route });

        response.setHeader(
          'Link',
          `<${links.self}>; rel=self, <${links.first}>; rel=first, <${links.last}>; rel=last, <${links.next}>; rel=next`,
        );
        response.setHeader('X-Pagination-Current-Page', paging.currentPage);
        response.setHeader('X-Pagination-Page-Count', paging.pageCount);
        response.setHeader('X-Pagination-Per-Page', paging.perPage);
        response.setHeader('X-Pagination-Total-Count', paging.totalCount);

        return data;
      }),
    );
  }

  paginate({ count, page, limit, route }) {
    const pages = Math.ceil(count / limit);
    const prevPage = page <= 1 ? 1 : page - 1;
    const nextPage = page >= pages ? pages : page + 1;

    const paging = {
      totalCount: count,
      perPage: limit,
      pageCount: pages,
      currentPage: page,
    };

    const havePrevPage = pages > 1;
    const haveNextPage = pages > 1 && pages > page;

    const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';
    const links = {
      self: `${route}${symbol}page=${page}`,
      first: `${route}${symbol}page=1`,
      prev: havePrevPage ? `${route}${symbol}page=${prevPage}` : null,
      next: haveNextPage ? `${route}${symbol}page=${nextPage}` : null,
      last: haveNextPage ? `${route}${symbol}page=${pages}` : null,
    };
    return { paging, links };
  }
}
