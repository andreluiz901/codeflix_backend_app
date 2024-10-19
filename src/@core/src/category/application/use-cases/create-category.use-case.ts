import {
	CategoryOutput,
	CategoryOutputMapper,
} from '#category/application/index';
import { Category } from '#category/domain/entities/category';
import CategoryRepository from '#category/domain/repository/category.repository';
import { default as DefaultUseCase } from '#seedwork/application/use-case';

export namespace CreateCategoryUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Category(input);
			await this.categoryRepo.insert(entity);
			return CategoryOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		description?: string;
		isActive?: boolean;
	};

	export type Output = CategoryOutput;
}

export default CreateCategoryUseCase;
