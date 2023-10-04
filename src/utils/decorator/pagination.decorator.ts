import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('req', request.query);
    if (request.query.page === undefined) {
      //memberikan nilai default 1 jika tidak dikirim client
      request.query.page = 1;
    }
    if (request.query.pageSize === undefined) {
      //memberikan nilai default 10 jika tidak dikirim client
      request.query.pageSize = 10;
    }

    request.query.limit =
      (Number(request.query.page) - 1) * Number(request.query.pageSize);
    request.query.pageSize = Number(request.query.pageSize);
    request.query.page = Number(request.query.page);
    return request.query;
  },
);
