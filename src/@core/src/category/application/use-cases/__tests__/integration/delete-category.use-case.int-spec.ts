import { DeleteCategoryUseCase } from '#category/application/use-cases/delete-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('DeleteCategoryUseCase Integration Test', () => {
	let useCase: DeleteCategoryUseCase.UseCase;
	let repository: CategorySequelize.CategoryRepository;

	SetupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategoryRepository(CategoryModel);
		useCase = new DeleteCategoryUseCase.UseCase(repository);
	});

	it('should throws error when entity not found', async () => {
		await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity Not Found using ID fake id'),
		);
	});

	it('should delete a category', async () => {
		const model = await CategoryModel.factory().create();
		await useCase.execute({ id: model.id });
		const noHasModel = await CategoryModel.findByPk();
		expect(noHasModel).toBeNull();
	});
});
