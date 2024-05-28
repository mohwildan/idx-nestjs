export class PaginatedEntity<T> {
  data: T[];
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;

  constructor(
    data: T[],
    meta: {
      totalData: number;
      page: number;
      limit: number;
    },
  ) {
    this.data = data;
    this.page = +meta.page;
    this.limit = +meta.limit;
    this.totalData = +meta.totalData;
    this.totalPage = Math.ceil(meta.totalData / meta.limit);
  }
}
