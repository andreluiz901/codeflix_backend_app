import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Inject,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {
	CreateCategoryUseCase,
	DeleteCategoryUseCase,
	GetCategoryUseCase,
	ListCategoriesUseCase,
	UpdateCategoryUseCase,
} from 'codeflix-backend-app/category/application';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
	@Inject(CreateCategoryUseCase.UseCase)
	private createUseCase: CreateCategoryUseCase.UseCase;

	@Inject(UpdateCategoryUseCase.UseCase)
	private updateUseCase: UpdateCategoryUseCase.UseCase;

	@Inject(DeleteCategoryUseCase.UseCase)
	private deleteUseCase: DeleteCategoryUseCase.UseCase;

	@Inject(GetCategoryUseCase.UseCase)
	private getUseCase: GetCategoryUseCase.UseCase;

	@Inject(ListCategoriesUseCase.UseCase)
	private listUseCase: ListCategoriesUseCase.UseCase;

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.createUseCase.execute({ ...createCategoryDto });
	}

	@Get()
	search(@Query() searchParams: SearchCategoryDto) {
		return this.listUseCase.execute(searchParams);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.getUseCase.execute({ id });
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.updateUseCase.execute({ id, ...updateCategoryDto });
	}

	@HttpCode(204)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.deleteUseCase.execute({ id });
	}
}
