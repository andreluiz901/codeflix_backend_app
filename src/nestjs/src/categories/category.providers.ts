import {
	CreateCategoryUseCase,
	DeleteCategoryUseCase,
	GetCategoryUseCase,
	ListCategoriesUseCase,
	UpdateCategoryUseCase,
} from 'codeflix-backend-app/category/application';
import {
	CategoryInMemoryRepository,
	CategorySequelize,
} from 'codeflix-backend-app/category/infra';
import CategoryRepository from 'codeflix-backend-app/dist/category/domain/repository/category.repository';

export namespace CATEGORY_PROVIDERS {
	export namespace REPOSITORIES {
		export const CATEGORY_IN_MEMORY_REPOSITORY = {
			provide: 'CategoryInMemoryRepository',
			useClass: CategoryInMemoryRepository,
		};

		export const CATEGORY_SEQUELIZE_REPOSITORY = {
			provide: 'CategorySequelizeRepository',
			useClass: CategorySequelize.CategoryRepository,
		};

		export const CATEGORY_REPOSITORY = {
			provide: 'CategoryRepository',
			useExisting: 'CategorySequelizeRepository',
		};
	}

	export namespace USECASES {
		export const CREATE_CATEGORY_USECASE = {
			provide: CreateCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new CreateCategoryUseCase.UseCase(categoryRepo);
			},
			inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
		};

		export const LIST_CATEGORY_USECASE = {
			provide: ListCategoriesUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new ListCategoriesUseCase.UseCase(categoryRepo);
			},
			inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
		};

		export const LUPDATE_CATEGORY_USECASE = {
			provide: UpdateCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new UpdateCategoryUseCase.UseCase(categoryRepo);
			},
			inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
		};

		export const DELETE_CATEGORY_USECASE = {
			provide: DeleteCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new DeleteCategoryUseCase.UseCase(categoryRepo);
			},
			inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
		};

		export const GET_CATEGORY_USECASE = {
			provide: GetCategoryUseCase.UseCase,
			useFactory: (categoryRepo: CategoryRepository.Repository) => {
				return new GetCategoryUseCase.UseCase(categoryRepo);
			},
			inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
		};
	}
}
