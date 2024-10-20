import { UpdateCategoryUseCase } from 'codeflix-backend-app/category/application';

export class UpdateCategoryDto
	implements Omit<UpdateCategoryUseCase.Input, 'id'>
{
	name: string;
	description?: string;
	isActive?: boolean;
}
