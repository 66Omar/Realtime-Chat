import { DEFAULT_PAGE_SIZE } from '../constants';
import { CursorQueryDto } from '../dto/cursor-query.dto';

export class CursorPagiantedResponse {
  data: any[];
  queries: CursorQueryDto;

  constructor(data: any, queries: CursorQueryDto) {
    this.data = data;
    this.queries = queries;
  }

  getPaginatedResponse(configuration?: { pageSize: number }) {
    const [results] = this.data;
    const limit =
      this.queries.limit || configuration?.pageSize || DEFAULT_PAGE_SIZE;

    const next =
      results.length === limit + 1 ? results[results.length - 2].id : null;

    const data = {
      limit: limit,
      next: next,
      results: next ? results.slice(0, results.length - 1) : results,
    };

    return data;
  }
}
