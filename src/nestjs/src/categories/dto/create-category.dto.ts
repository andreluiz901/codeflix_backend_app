import { CreateCategoryUseCase } from 'codeflix-backend-app/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
	name: string;
	description?: string;
	isActive?: boolean;
}
