import { DEFAULT_PAGE_SIZE } from '../constants';
import { GenericQueryDto } from '../dto/offset-query.dto';

export class OffsetPaginatedResponse {
  data: any[];
  queries: GenericQueryDto;

  constructor(data: any, queries: GenericQueryDto) {
    this.data = data;
    this.queries = queries;
  }
//TODO: HUUHUHUUHUHUH
  getPaginatedResponse(configuration?: { pageSize: number }) {
    const [results, count] = this.data;
    const offset = this.queries.offset || 0;
    const limit =
      this.queries.limit || configuration?.pageSize || DEFAULT_PAGE_SIZE;
    const nextOffset = offset + limit;
    const next = nextOffset < count ? nextOffset : null;

    const data = {
      offset: offset,
      limit: limit,
      count: count,
      next: next,
      results: results,
    };

    return data;
  }
}
