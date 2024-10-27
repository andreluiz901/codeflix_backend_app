import _Chance from 'chance';
import ListCategoriesUseCase from '#category/application/use-cases/list-categories.use-case';
import { CategoryRepository as CategoryRepositoryContract } from '#category/domain';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';

const { CategoryRepository, CategoryModel, CategoryModelMapper } =
	CategorySequelize;

describe('ListCategoryUseCase Integration Test', () => {
	let useCase: ListCategoriesUseCase.UseCase;
	let repository: CategorySequelize.CategoryRepository;

	SetupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategoryRepository(CategoryModel);
		useCase = new ListCategoriesUseCase.UseCase(repository);
	});

	it('should return output using empty input with categories ordered by createdAt', async () => {
		const models = await CategoryModel.factory()
			.count(2)
			.bulkCreate((index: number) => {
				const chance = _Chance();
				return {
					id: chance.guid({ version: 4 }),
					name: `category ${index}`,
					description: 'some description',
					isActive: true,
					createdAt: new Date(new Date().getTime() + index),
				};
			});

		const output = await useCase.execute({});
		expect(output).toMatchObject({
			items: [...models]
				.reverse()
				.map(CategoryModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 2,
			currentPage: 1,
			perPage: 15,
			lastPage: 1,
		});
	});

	it.skip('should returns output using pagination, sort and filter', async () => {
		const models = CategoryModel.factory().count(5).bulkMake();

		models[0].name = 'a';
		models[1].name = 'AAA';
		models[2].name = 'AaA';
		models[3].name = 'b';
		models[4].name = 'c';

		await CategoryModel.bulkCreate(models.map((model) => model.toJSON()));

		let output = await useCase.execute({
			page: 1,
			perPage: 2,
			sort: 'name',
			filter: 'a',
		});
		expect(output).toMatchObject({
			items: [models[1], models[2]]
				.map(CategorySequelize.CategoryModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			currentPage: 1,
			perPage: 2,
			lastPage: 2,
		});

		output = await useCase.execute({
			page: 2,
			perPage: 2,
			sort: 'name',
			filter: 'a',
		});
		expect(output).toMatchObject({
			items: [models[0]]
				.map(CategorySequelize.CategoryModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			currentPage: 2,
			perPage: 2,
			lastPage: 2,
		});

		output = await useCase.execute({
			page: 1,
			perPage: 2,
			sort: 'name',
			sortDir: 'desc',
			filter: 'a',
		});
		expect(output).toMatchObject({
			items: [models[0], models[2]]
				.map(CategorySequelize.CategoryModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			currentPage: 1,
			perPage: 2,
			lastPage: 2,
		});
	});
});
