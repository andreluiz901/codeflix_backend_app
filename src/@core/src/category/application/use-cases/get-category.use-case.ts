import {
	CategoryOutput,
	CategoryOutputMapper,
} from '#category/application/dto/index';
import CategoryRepository from '#category/domain/repository/category.repository';
import { default as DefaultuseCase } from '#seedwork/application/use-case';

export namespace GetCategoryUseCase {
	export class UseCase implements DefaultuseCase<Input, Output> {
		constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.categoryRepo.findById(input.id);
			return CategoryOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = CategoryOutput;
}

export default GetCategoryUseCase;
