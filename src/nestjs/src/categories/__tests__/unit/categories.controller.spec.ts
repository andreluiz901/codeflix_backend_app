import { SortDirection } from 'codeflix-backend-app/@seedwork/domain';
import {
	CreateCategoryUseCase,
	GetCategoryUseCase,
	ListCategoriesUseCase,
	UpdateCategoryUseCase,
} from 'codeflix-backend-app/category/application';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
	let controller: CategoriesController;

	beforeEach(async () => {
		controller = new CategoriesController();
	});

	it('should create a category', async () => {
		const expectedOutput: CreateCategoryUseCase.Output = {
			id: '43a9171c-beae-40e3-b010-dde138a29b3c',
			name: 'Movie',
			description: 'some description',
			isActive: true,
			CreatedAt: new Date(),
		};
		const mockCreateUseCase = {
			execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
		};
		// @ts-expect-error
		controller['createUseCase'] = mockCreateUseCase;
		const input: CreateCategoryDto = {
			name: 'Movie',
			description: 'some description',
			isActive: true,
		};
		const output = await controller.create(input);
		expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
		expect(expectedOutput).toStrictEqual(output);
	});

	it('should update a category', async () => {
		const id = '43a9171c-beae-40e3-b010-dde138a29b3c';
		const expectedOutput: UpdateCategoryUseCase.Output = {
			id,
			name: 'Movie',
			description: 'some description',
			isActive: true,
			CreatedAt: new Date(),
		};
		const mockUpdateUseCase = {
			execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
		};
		// @ts-expect-error
		controller['updateUseCase'] = mockUpdateUseCase;
		const input: UpdateCategoryDto = {
			name: 'Movie',
			description: 'some description',
			isActive: true,
		};
		const output = await controller.update(id, input);
		expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
		expect(expectedOutput).toStrictEqual(output);
	});

	it('should delete a category', async () => {
		const expectedOutput = undefined;
		const mockDeleteUseCase = {
			execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
		};
		// @ts-expect-error
		controller['deleteUseCase'] = mockDeleteUseCase;
		const id = '43a9171c-beae-40e3-b010-dde138a29b3c';
		expect(controller.remove(id)).toBeInstanceOf(Promise);

		const output = await controller.remove(id);
		expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
		expect(expectedOutput).toStrictEqual(output);
	});

	it('should get a category', async () => {
		const id = '43a9171c-beae-40e3-b010-dde138a29b3c';
		const expectedOutput: GetCategoryUseCase.Output = {
			id,
			name: 'Movie',
			description: 'some description',
			isActive: true,
			CreatedAt: new Date(),
		};
		const mockGetUseCase = {
			execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
		};
		// @ts-expect-error
		controller['getUseCase'] = mockGetUseCase;
		const output = await controller.findOne(id);
		expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
		expect(expectedOutput).toStrictEqual(output);
	});

	it('should list a category', async () => {
		const id = '43a9171c-beae-40e3-b010-dde138a29b3c';
		const expectedOutput: ListCategoriesUseCase.Output = {
			items: [
				{
					id,
					name: 'Movie',
					description: 'some description',
					isActive: true,
					CreatedAt: new Date(),
				},
			],
			currentPage: 1,
			lastPage: 1,
			perPage: 1,
			total: 1,
		};

		const mockListUseCase = {
			execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
		};
		// @ts-expect-error
		controller['listUseCase'] = mockListUseCase;
		const searchParams = {
			page: 1,
			perPage: 2,
			sort: 'name',
			sortDir: 'desc' as SortDirection,
			filter: 'test',
		};
		const output = await controller.search(searchParams);
		expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
		expect(expectedOutput).toStrictEqual(output);
	});
});
