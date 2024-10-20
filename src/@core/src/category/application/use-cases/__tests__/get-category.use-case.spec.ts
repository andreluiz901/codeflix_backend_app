import { GetCategoryUseCase } from '#category/application/use-cases/get-category.use-case';
import { Category } from '#category/domain/entities/category';
import CategoryInMemoryRepository from '#category/infra/db/in-memory/category-in-memory.repository';
import NotFoundError from '#seedwork/domain/errors/not-found.error';

describe('GetCategoryUseCase Unit Test', () => {
	let useCase: GetCategoryUseCase.UseCase;
	let repository: CategoryInMemoryRepository;

	beforeEach(() => {
		repository = new CategoryInMemoryRepository();
		useCase = new GetCategoryUseCase.UseCase(repository);
	});

	it('should throws error when entity not found', async () => {
		expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity Not Found using ID fake id'),
		);
	});

	it('should returns a category', async () => {
		const items = [new Category({ name: 'Movie' })];
		repository.items = items;
		const spyFindById = jest.spyOn(repository, 'findById');
		const output = await useCase.execute({ id: items[0].id });
		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: items[0].id,
			name: 'Movie',
			description: null,
			isActive: true,
			createdAt: items[0].createdAt,
		});
	});
});
