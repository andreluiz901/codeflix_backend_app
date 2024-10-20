import { DataType, Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category.model';

describe('CategoryModel unit test', () => {
	let sequelize: Sequelize;

	beforeAll(
		() =>
			(sequelize = new Sequelize({
				dialect: 'sqlite',
				host: ':memory',
				logging: false,
				models: [CategoryModel],
			})),
	);

	beforeEach(async () => await sequelize.sync({ force: true }));

	afterAll(async () => await sequelize.close());

	test('mapping props', () => {
		const attributesMap = CategoryModel.getAttributes();
		const attributes = Object.keys(CategoryModel.getAttributes());
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'description',
			'isActive',
			'createdAt',
		]);
		const idAttr = attributesMap.id;
		expect(idAttr).toMatchObject({
			field: 'id',
			fieldName: 'id',
			primaryKey: true,
			type: DataType.UUID(),
		});

		const nameAttr = attributesMap.name;
		expect(nameAttr).toMatchObject({
			field: 'name',
			fieldName: 'name',
			allowNull: false,
			type: DataType.STRING(255),
		});

		const descriptionAttr = attributesMap.description;
		expect(descriptionAttr).toMatchObject({
			field: 'description',
			fieldName: 'description',
			allowNull: true,
			type: DataType.TEXT(),
		});

		const isActiveAttr = attributesMap.isActive;
		expect(isActiveAttr).toMatchObject({
			field: 'is_active',
			fieldName: 'isActive',
			allowNull: false,
			type: DataType.BOOLEAN(),
		});

		const createdAtAttr = attributesMap.createdAt;
		expect(createdAtAttr).toMatchObject({
			field: 'created_at',
			fieldName: 'createdAt',
			allowNull: false,
			type: DataType.DATE(),
		});
	});

	it('create', async () => {
		const arrange = {
			id: '76a2d112-00b2-4a2b-a244-e37a67cc816a',
			name: 'test',
			isActive: true,
			createdAt: new Date(),
		};
		const category = await CategoryModel.create(arrange);

		expect(category.toJSON()).toStrictEqual(arrange);
	});
});
