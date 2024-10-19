import { ListCategoriesUseCase } from 'codeflix-backend-app/category/application';
import { SortDirection } from 'codeflix-backend-app/dist/@seedwork/domain';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
	page?: number;
	perPage?: number;
	sort?: string | null;
	sortDir?: SortDirection | null;
	filter?: string;
}
