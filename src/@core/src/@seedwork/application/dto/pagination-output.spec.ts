import { SearchResult } from '#seedwork/domain/';
import { PaginationOutputMapper } from './pagination-output';

describe('PaginationOutputMapper Unit Test', () => {
	it('should convert a search result in output', () => {
		const result = new SearchResult({
			items: ['fake'] as any,
			total: 1,
			currentPage: 1,
			perPage: 1,
			sort: 'name',
			sortDir: 'desc',
			filter: 'fake',
		});
		const output = PaginationOutputMapper.toOutput(result);
		expect(output).toStrictEqual({
			total: 1,
			currentPage: 1,
			lastPage: 1,
			perPage: 1,
		});
	});
});
