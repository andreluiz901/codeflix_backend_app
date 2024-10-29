import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CATEGORY_PROVIDERS } from './category.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategorySequelize } from 'codeflix-backend-app/category/infra';

@Module({
	imports: [SequelizeModule.forFeature([CategorySequelize.CategoryModel])],
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
		...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
		...Object.values(CATEGORY_PROVIDERS.USECASES),
	],
})
export class CategoriesModule {}
