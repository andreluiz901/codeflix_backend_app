import UpdateCategoryUseCase from '#category/application/use-cases/update-category.use-case';
import { Category } from '#category/domain/entities/category';
import CategoryInMemoryRepository from '#category/infra/db/in-memory/category-in-memory.repository';
import NotFoundError from '#seedwork/domain/errors/not-found.error';

describe('UpdateCategoryUseCase Unit Test', () => {
	let useCase: UpdateCategoryUseCase.UseCase;
	let repository: CategoryInMemoryRepository;

	beforeEach(() => {
		repository = new CategoryInMemoryRepository();
		useCase = new UpdateCategoryUseCase.UseCase(repository);
	});

	it('should throws error when entity not found', async () => {
		expect(() =>
			useCase.execute({ id: 'fake id', name: 'fake' }),
		).rejects.toThrow(new NotFoundError('Entity Not Found using ID fake id'));
	});

	it('should update a category', async () => {
		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new Category({ name: 'Movie' });
		repository.items = [entity];
		let output = await useCase.execute({ id: entity.id, name: 'test' });
		expect(spyUpdate).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'test',
			description: null,
			isActive: true,
			createdAt: entity.createdAt,
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
				input: { id: entity.id, name: 'test', description: 'some description' },
				expected: {
					id: entity.id,
					name: 'test',
					description: 'some description',
					isActive: true,
					createdAt: entity.createdAt,
				},
			},
			{
				input: { id: entity.id, name: 'test' },
				expected: {
					id: entity.id,
					name: 'test',
					description: null,
					isActive: true,
					createdAt: entity.createdAt,
				},
			},
			{
				input: { id: entity.id, name: 'test', isActive: false },
				expected: {
					id: entity.id,
					name: 'test',
					description: null,
					isActive: false,
					createdAt: entity.createdAt,
				},
			},
			{
				input: { id: entity.id, name: 'test' },
				expected: {
					id: entity.id,
					name: 'test',
					description: null,
					isActive: false,
					createdAt: entity.createdAt,
				},
			},
			{
				input: { id: entity.id, name: 'test', isActive: true },
				expected: {
					id: entity.id,
					name: 'test',
					description: null,
					isActive: true,
					createdAt: entity.createdAt,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'test',
					description: 'some description',
					isActive: false,
				},
				expected: {
					id: entity.id,
					name: 'test',
					description: 'some description',
					isActive: false,
					createdAt: entity.createdAt,
				},
			},
		];

		for (const i of arrange) {
			output = await useCase.execute(i.input);
			expect(output).toStrictEqual(i.expected);
		}
	});
});
