import {
	CategoryOutput,
	CategoryOutputMapper,
} from '#category/application/dto/index';
import CategoryRepository from '#category/domain/repository/category.repository';
import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '#seedwork/application/dto/pagination-output';
import { SearchInputDto } from '#seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '#seedwork/application/use-case';

export namespace ListCategoriesUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new CategoryRepository.SearchParams(input);
			const searchResult = await this.categoryRepo.search(params);
			return this.toOutput(searchResult);
		}

		private toOutput(searchResult: CategoryRepository.SearchResult): Output {
			const items = searchResult.items.map((i) =>
				CategoryOutputMapper.toOutput(i),
			);
			const pagination = PaginationOutputMapper.toOutput(searchResult);
			return {
				items,
				...pagination,
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<CategoryOutput>;
}

export default ListCategoriesUseCase;
