import UpdateCategoryUseCase from '#category/application/use-cases/update-category.use-case';
import { Category } from '#category/domain/entities/category';
import CategoryInMemoryRepository from '#category/infra/db/in-memory/category-in-memory.repository';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('UpdateCategoryUseCase Integration Test', () => {
	let useCase: UpdateCategoryUseCase.UseCase;
	let repository: CategorySequelize.CategoryRepository;

	SetupSequelize({ models: [CategoryModel] });
	beforeEach(() => {
		repository = new CategoryRepository(CategoryModel);
		useCase = new UpdateCategoryUseCase.UseCase(repository);
	});

	it('should throws error when entity not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'fake id', name: 'fake' }),
		).rejects.toThrow(new NotFoundError('Entity Not Found using ID fake id'));
	});

	it('should update a category', async () => {
		const model = await CategoryModel.factory().create();
		let output = await useCase.execute({ id: model.id, name: 'test' });
		expect(output).toStrictEqual({
			id: model.id,
			name: 'test',
			description: null,
			isActive: true,
			createdAt: model.createdAt,
		});

		type Arrange = {
			input: {
				id: string;
				name: string;
				description?: null | string;
				isActive?: boolean;
			};
			expected: {
				id: string;
				name: string;
				description: string | null;
				isActive: boolean;
				createdAt: Date;
			};
		};

		const arrange: Arrange[] = [
			{
				input: { id: model.id, name: 'test', description: 'some description' },
				expected: {
					id: model.id,
					name: 'test',
					description: 'some description',
					isActive: true,
					createdAt: model.createdAt,
				},
			},
			{
				input: { id: model.id, name: 'test' },
				expected: {
					id: model.id,
					name: 'test',
					description: null,
					isActive: true,
					createdAt: model.createdAt,
				},
			},
			{
				input: { id: model.id, name: 'test', isActive: false },
				expected: {
					id: model.id,
					name: 'test',
					description: null,
					isActive: false,
					createdAt: model.createdAt,
				},
			},
			{
				input: { id: model.id, name: 'test' },
				expected: {
					id: model.id,
					name: 'test',
					description: null,
					isActive: false,
					createdAt: model.createdAt,
				},
			},
			{
				input: { id: model.id, name: 'test', isActive: true },
				expected: {
					id: model.id,
					name: 'test',
					description: null,
					isActive: true,
					createdAt: model.createdAt,
				},
			},
			{
				input: {
					id: model.id,
					name: 'test',
					description: 'some description',
					isActive: false,
				},
				expected: {
					id: model.id,
					name: 'test',
					description: 'some description',
					isActive: false,
					createdAt: model.createdAt,
				},
			},
		];

		for (const i of arrange) {
			output = await useCase.execute(i.input);
			expect(output).toStrictEqual(i.expected);
		}
	});
});
