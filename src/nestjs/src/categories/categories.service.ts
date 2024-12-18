import { Inject, Injectable } from '@nestjs/common';
import {
	CreateCategoryUseCase,
	ListCategoriesUseCase,
} from 'codeflix-backend-app/category/application';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
	@Inject(CreateCategoryUseCase.UseCase)
	private readonly createUseCase: CreateCategoryUseCase.UseCase;

	@Inject(ListCategoriesUseCase.UseCase)
	private readonly listUseCase: ListCategoriesUseCase.UseCase;

	create(createCategoryDto: CreateCategoryUseCase.Input) {
		return this.createUseCase.execute(createCategoryDto);
	}

	search(input: ListCategoriesUseCase.Input) {
		return this.listUseCase.execute(input);
	}

	findOne(id: number) {
		return `This action returns a #${id} category`;
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		return `This action updates a #${id} category`;
	}

	remove(id: number) {
		return `This action removes a #${id} category`;
	}
}
