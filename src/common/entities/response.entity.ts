export class ResponseEntity<T> {
  message?: string;
  validation?: Record<string, string[]>;
  results?: {
    data: T;
    pagination?: {
      page: number;
      limit: number;
      totalData: number;
      totalPage: number;
    };
  };

  constructor({ message, results, validation }: ResponseEntity<T>) {
    this.message = message || 'success';
    this.results = results || {
      data: {} as T,
    };
    this.validation = validation || {};
  }
}
