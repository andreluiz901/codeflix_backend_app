import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	CreateCategoryUseCase,
	ListCategoriesUseCase,
} from 'codeflix-backend-app/category/application';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly categoriesService: CategoriesService,
		private readonly createUseCase: CreateCategoryUseCase.UseCase,
		private readonly listUseCase: ListCategoriesUseCase.UseCase,
	) {}

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.createUseCase.execute({ name: 'teste' });
		//return this.categoriesService.create(createCategoryDto);
	}

	@Get()
	findAll() {
		return this.listUseCase.execute({});
		// return this.categoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(+id, updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(+id);
	}
}
