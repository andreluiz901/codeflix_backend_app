import { UpdateCategoryUseCase } from 'codeflix-backend-app/category/application';

export class UpdateCategoryDto implements UpdateCategoryUseCase.Input {
	id: string;
	name: string;
	description?: string;
	isActive?: boolean;
}
