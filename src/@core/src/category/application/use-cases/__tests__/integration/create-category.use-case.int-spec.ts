import { CreateCategoryUseCase } from '#category/application/use-cases/create-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('CreateCategoryUseCase Integration Test', () => {
	let useCase: CreateCategoryUseCase.UseCase;
	let repository: CategorySequelize.CategoryRepository;

	SetupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategoryRepository(CategoryModel);
		useCase = new CreateCategoryUseCase.UseCase(repository);
	});

	// describe('test with test.each', () => {
	// 	const arrange = [
	// 		{
	// 			inputProps: { name: 'test' },
	// 			outputProps: {
	// 				name: 'test',
	// 				description: null,
	// 				isActive: true,
	// 			},
	// 		},
	// 	];
	// 	test.each(arrange)(
	// 		'input $inputProps, output $outputProps',
	// 		async ({ inputProps, outputProps }) => {
	// 			const output = await useCase.execute(inputProps);
	// 			const entity = await repository.findById(output.id);
	// 			expect(output.id).toBe(entity.id);
	// 			expect(output.createdAt).toStrictEqual(entity.createdAt);
	// 			expect(output).toMatchObject(outputProps);
	// 		},
	// 	);
	// });

	it('should create a category', async () => {
		let output = await useCase.execute({ name: 'test' });
		let entity = await repository.findById(output.id);
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'test',
			description: null,
			isActive: true,
			createdAt: entity.createdAt,
		});

		output = await useCase.execute({
			name: 'test',
			description: 'some description',
		});
		entity = await repository.findById(output.id);
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'test',
			description: 'some description',
			isActive: true,
			createdAt: entity.createdAt,
		});

		output = await useCase.execute({
			name: 'test',
			description: 'some description',
			isActive: true,
		});
		entity = await repository.findById(output.id);
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'test',
			description: 'some description',
			isActive: true,
			createdAt: entity.createdAt,
		});

		output = await useCase.execute({
			name: 'test',
			description: 'some description',
			isActive: false,
		});
		entity = await repository.findById(output.id);
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'test',
			description: 'some description',
			isActive: false,
			createdAt: entity.createdAt,
		});
	});
});
