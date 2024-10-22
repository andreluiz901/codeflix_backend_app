import { Op } from 'sequelize';
import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { CategoryModelMapper } from './category-mapper';
import { CategoryModel } from './category-model';

export class CategorySequelizeRepository
	implements CategoryRepository.Repository
{
	sortableFields: string[] = ['name', 'created_at'];

	constructor(private categoryModel: typeof CategoryModel) {}

	async search(
		props: CategoryRepository.SearchParams,
	): Promise<CategoryRepository.SearchResult> {
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

		return new CategoryRepository.SearchResult({
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
