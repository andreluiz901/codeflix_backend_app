import { Category } from '#category/domain/entities/category';
import {
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
	SearchableRepositoryInterface,
} from '#seedwork/domain/repository/repository-contratcs';

export namespace CategoryRepository {
	export type Filter = string; // NOSONAR

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<Category, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
			Category,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default CategoryRepository;
