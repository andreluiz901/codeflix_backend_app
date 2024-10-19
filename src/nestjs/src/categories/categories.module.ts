import { Module } from '@nestjs/common';
import {
	CreateCategoryUseCase,
	DeleteCategoryUseCase,
	GetCategoryUseCase,
	ListCategoriesUseCase,
	UpdateCategoryUseCase,
} from 'codeflix-backend-app/category/application';
import { CategoryInMemoryRepository } from 'codeflix-backend-app/category/infra';
import CategoryRepository from 'codeflix-backend-app/dist/category/domain/repository/category.repository';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
		{
			provide: 'CategoryInMemoryRepository',
			useClass: CategoryInMemoryRepository,
		},
		{
			provide: CreateCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new CreateCategoryUseCase.UseCase(categoryRepo);
			},
			inject: ['CategoryInMemoryRepository'],
		},
		{
			provide: ListCategoriesUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new ListCategoriesUseCase.UseCase(categoryRepo);
			},
			inject: ['CategoryInMemoryRepository'],
		},
		{
			provide: UpdateCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new UpdateCategoryUseCase.UseCase(categoryRepo);
			},
			inject: ['CategoryInMemoryRepository'],
		},
		{
			provide: DeleteCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new DeleteCategoryUseCase.UseCase(categoryRepo);
			},
			inject: ['CategoryInMemoryRepository'],
		},
		{
			provide: GetCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new GetCategoryUseCase.UseCase(categoryRepo);
			},
			inject: ['CategoryInMemoryRepository'],
		},
	],
})
export class CategoriesModule {}
