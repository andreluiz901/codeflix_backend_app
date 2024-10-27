import { Op } from 'sequelize';
import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import {
	Category,
	CategoryRepository as CategoryRepositoryContract,
} from '#category/domain';
import {
	EntityValidationError,
	LoadEntityError,
	NotFoundError,
	UniqueEntityId,
} from '#seedwork/domain';
import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model-factory';

export namespace CategorySequelize {
	type CategoryModelProperties = {
		id: string;
		name: string;
		description: string | null;
		isActive: boolean;
		createdAt: Date;
	};

	@Table({ tableName: 'categories', timestamps: false })
	export class CategoryModel extends Model<CategoryModelProperties> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare name: string;

		@Column({ allowNull: true, type: DataType.TEXT })
		declare description: string | null;

		@Column({ allowNull: false, type: DataType.BOOLEAN, field: 'is_active' })
		declare isActive: boolean;

		@Column({ allowNull: false, type: DataType.DATE(), field: 'created_at' })
		declare createdAt: Date;

		static factory() {
			const chance: Chance.Chance = require('chance')();

			return new SequelizeModelFactory<CategoryModel, CategoryModelProperties>(
				CategoryModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word(),
					description: chance.paragraph(),
					isActive: true,
					createdAt: chance.date(),
				}),
			);
		}
	}

	export class CategoryRepository
		implements CategoryRepositoryContract.Repository
	{
		sortableFields: string[] = ['name', 'created_at'];

		constructor(private categoryModel: typeof CategoryModel) {}

		async search(
			props: CategoryRepositoryContract.SearchParams,
		): Promise<CategoryRepositoryContract.SearchResult> {
			const offset = (props.page - 1) * props.perPage;
			const limit = props.perPage;

			const { rows: models, count } = await this.categoryModel.findAndCountAll({
				...(props.filter && {
					where: { name: { [Op.like]: `${props.filter}` } },
				}),
				...(props.sort && this.sortableFields.includes(props.sort)
					? { order: [[props.sort, props.sortDir]] }
					: { order: [['createdAt', 'DESC']] }),
				limit,
				offset,
			});

			return new CategoryRepositoryContract.SearchResult({
				items: models.map((model) => CategoryModelMapper.toEntity(model)),
				currentPage: props.page,
				perPage: props.perPage,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sortDir: props.sortDir,
			});
		}

		async insert(entity: Category): Promise<void> {
			await this.categoryModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<Category> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return CategoryModelMapper.toEntity(model);
		}

		async findAll(): Promise<Category[]> {
			const models = await this.categoryModel.findAll();
			return models.map((model) => CategoryModelMapper.toEntity(model));
		}

		async update(entity: Category): Promise<void> {
			throw new Error('Method not implemented.');
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			throw new Error('Method not implemented.');
		}

		private async _get(id: string): Promise<CategoryModel> {
			return await this.categoryModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`),
			});
		}
	}

	export class CategoryModelMapper {
		static toEntity(model: CategoryModel) {
			const { id, ...otherData } = model.toJSON();
			try {
				return new Category(otherData, new UniqueEntityId(id));
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}
				throw e;
			}
		}
	}
}
