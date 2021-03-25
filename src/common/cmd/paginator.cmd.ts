import { Paginator } from '../';

export class PaginatorCmd<T> {
  constructor(data: Paginator<T>) {
    this.data = data.data;
    this.total = data.total;
    this.limit = data.limit;
    this.skip = data.skip;
    this.page = data.page;
    this.pages = data.pages;
  }
  data: T[];
  total: number;
  limit: number;
  skip: number;
  page: number;
  pages: number;
}
