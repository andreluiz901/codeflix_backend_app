import _chance from 'chance';
import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CategoryModelMapper } from './category-mapper';
import { CategoryModel } from './category-model';
import { CategorySequelizeRepository } from './category-repository';

describe('CategorySequelizeRepository unit Test', () => {
	SetupSequelize({ models: [CategoryModel] });
	let chance: Chance.Chance;
	let repository: CategorySequelizeRepository;

	beforeAll(() => {
		chance = _chance();
	});

	beforeEach(async () => {
		repository = new CategorySequelizeRepository(CategoryModel);
	});

	it('should insert a new entity', async () => {
		let category = new Category({ name: 'Movie' });
		await repository.insert(category);
		let model = await CategoryModel.findByPk(category.id);
		expect(model.toJSON()).toStrictEqual(category.toJSON());

		category = new Category({
			name: 'Movie',
			description: 'some description',
			isActive: false,
		});
		await repository.insert(category);
		model = await CategoryModel.findByPk(category.id);
		expect(model.toJSON()).toStrictEqual(category.toJSON());
	});

	it('should throws an error when entity not found', async () => {
		await expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Entity Not Found using ID fake id'),
		);

		await expect(
			repository.findById(
				new UniqueEntityId('855795e2-2064-49b3-94bb-45c193cc01eb'),
			),
		).rejects.toThrow(
			new NotFoundError(
				'Entity Not Found using ID 855795e2-2064-49b3-94bb-45c193cc01eb',
			),
		);
	});

	it('should finds entity by id', async () => {
		const entity = new Category({ name: 'movie' });
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should return all categories', async () => {
		const entity = new Category({ name: 'movie' });
		await repository.insert(entity);
		const entities = await repository.findAll();
		expect(entities).toHaveLength(1);
		expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
	});

	describe('search method tests', () => {
		it('should only apply paginate when other params are null ', async () => {
			const createdAt = new Date();
			await CategoryModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: 'Movie',
					description: null,
					isActive: true,
					createdAt,
				}));
			const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
			const searchOutput = await repository.search(
				new CategoryRepository.SearchParams(),
			);
			expect(spyToEntity).toHaveBeenCalledTimes(15);
			expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
			expect(searchOutput.toJSON()).toMatchObject({
				total: 16,
				currentPage: 1,
				lastPage: 2,
				perPage: 15,
				sort: null,
				sortDir: null,
				filter: null,
			});
			searchOutput.items.forEach((item) => {
				expect(item).toBeInstanceOf(Category);
				expect(item.id).toBeDefined();
			});
			const items = searchOutput.items.map((item) => item.toJSON());
			expect(items).toMatchObject(
				new Array(15).fill({
					name: 'Movie',
					description: null,
					isActive: true,
					createdAt,
				}),
			);
		});

		it('should order by createdAt DESC when searc params are null', async () => {
			const createdAt = new Date();
			await CategoryModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `Movie${index}`,
					description: null,
					isActive: true,
					createdAt: new Date(createdAt.getTime() + 100 + index),
				}));
			const searchOutput = await repository.search(
				new CategoryRepository.SearchParams(),
			);
			searchOutput.items.reverse();
			searchOutput.items.forEach((item, index) => {
				expect(`${item.name}${index + 1}`);
			});
		});

		it('should apply paginated and filter', async () => {
			const defaultProps = {
				description: null,
				isActive: true,
				createdAt: new Date(),
			};

			const categoriesProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'test',
					price: 5,
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'a',
					price: 5,
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TEST',
					price: 5,
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TeSt',
					price: 5,
					...defaultProps,
				},
			];

			const categories = await CategoryModel.bulkCreate(categoriesProp);

			let searchOutput = await repository.search(
				new CategoryRepository.SearchParams({
					page: 1,
					perPage: 2,
					filter: 'TEST',
				}),
			);

			expect(searchOutput.toJSON(true)).toMatchObject(
				new CategoryRepository.SearchResult({
					items: [
						CategoryModelMapper.toEntity(categories[0]),
						CategoryModelMapper.toEntity(categories[2]),
					],
					total: 3,
					currentPage: 1,
					perPage: 2,
					sort: null,
					sortDir: null,
					filter: 'TEST',
				}).toJSON(true),
			);

			searchOutput = await repository.search(
				new CategoryRepository.SearchParams({
					page: 2,
					perPage: 2,
					filter: 'TEST',
				}),
			);

			expect(searchOutput.toJSON(true)).toMatchObject(
				new CategoryRepository.SearchResult({
					items: [CategoryModelMapper.toEntity(categories[3])],
					total: 3,
					currentPage: 2,
					perPage: 2,
					sort: null,
					sortDir: null,
					filter: 'TEST',
				}).toJSON(true),
			);
		});

		it('should apply paginated and sort', async () => {
			expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);

			const defaultProps = {
				description: null,
				isActive: true,
				createdAt: new Date(),
			};

			const categoriesProp = [
				{ id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
			];

			const categories = await CategoryModel.bulkCreate(categoriesProp);

			const arrange = [
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						perPage: 2,
						sort: 'name',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[1]),
							CategoryModelMapper.toEntity(categories[0]),
						],
						total: 5,
						currentPage: 1,
						perPage: 2,
						sort: 'name',
						sortDir: 'asc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 2,
						perPage: 2,
						sort: 'name',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[4]),
							CategoryModelMapper.toEntity(categories[2]),
						],
						total: 5,
						currentPage: 2,
						perPage: 2,
						sort: 'name',
						sortDir: 'asc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						perPage: 2,
						sort: 'name',
						sortDir: 'desc',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[3]),
							CategoryModelMapper.toEntity(categories[2]),
						],
						total: 5,
						currentPage: 1,
						perPage: 2,
						sort: 'name',
						sortDir: 'desc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 2,
						perPage: 2,
						sort: 'name',
						sortDir: 'desc',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[4]),
							CategoryModelMapper.toEntity(categories[0]),
						],
						total: 5,
						currentPage: 2,
						perPage: 2,
						sort: 'name',
						sortDir: 'desc',
						filter: null,
					}),
				},
			];

			for (const i of arrange) {
				const result = await repository.search(i.params);
				console.log('result', result);
				console.log('i-result', i.result);
				expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
			}
		});
	});
});
