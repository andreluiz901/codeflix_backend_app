import Entity from '#seedwork/domain/entity/entity';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import {
	RepositoryInterface,
	SearchParams,
	SearchResult,
	SearchableRepositoryInterface,
	SortDirection,
} from '#seedwork/domain/repository/repository-contratcs';
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';

export abstract class InMemoryRepository<E extends Entity>
	implements RepositoryInterface<E>
{
	items: E[] = [];

	async insert(entity: E): Promise<void> {
		this.items.push(entity);
	}
	async findById(id: string | UniqueEntityId): Promise<E> {
		const _id = `${id}`;
		return this._get(_id);
	}
	async findAll(): Promise<E[]> {
		return this.items;
	}
	async update(entity: E): Promise<void> {
		await this._get(entity.id);
		const indexFound = this.items.findIndex((i) => i.id === entity.id);
		this.items[indexFound] = entity;
	}
	async delete(id: string | UniqueEntityId): Promise<void> {
		const _id = `${id}`;
		await this._get(_id);
		const indexFound = this.items.findIndex((i) => i.id === _id);
		this.items.splice(indexFound, 1);
	}

	protected async _get(id: string): Promise<E> {
		const item = this.items.find((item) => item.id === id);
		if (!item) {
			throw new NotFoundError(`Entity Not Found using ID ${id}`);
		}
		return item;
	}
}

export abstract class InMemorySearchableRepository<E extends Entity>
	extends InMemoryRepository<E>
	implements SearchableRepositoryInterface<E>
{
	sortableFields: string[] = [];

	async search(props: SearchParams): Promise<SearchResult<E>> {
		const itemsFiltered = await this.applyFilter(this.items, props.filter);
		const itemsSorted = await this.applySort(
			itemsFiltered,
			props.sort,
			props.sortDir,
		);
		const itemsPaginated = await this.applyPaginate(
			itemsSorted,
			props.page,
			props.perPage,
		);

		return new SearchResult({
			items: itemsPaginated,
			total: itemsFiltered.length,
			currentPage: props.page,
			perPage: props.perPage,
			sort: props.sort,
			sortDir: props.sortDir,
			filter: props.filter,
		});
	}

	protected abstract applyFilter(
		items: E[],
		filter: string | null,
	): Promise<E[]>;

	protected async applySort(
		items: E[],
		sort: string | null,
		sortDir: SortDirection | null,
	): Promise<E[]> {
		if (!sort || !this.sortableFields.includes(sort)) {
			return items;
		}

		return [...items].sort((a, b) => {
			if (a.props[sort] < b.props[sort]) {
				return sortDir === 'asc' ? -1 : 1;
			}
			if (a.props[sort] > b.props[sort]) {
				return sortDir === 'asc' ? 1 : -1;
			}
			return 0;
		});
	}

	protected async applyPaginate(
		items: E[],
		page: SearchParams['page'],
		perPage: SearchParams['perPage'],
	): Promise<E[]> {
		const start = (page - 1) * perPage; // 0 * 15 = 0
		const limit = start + perPage; // 0 + 15 = 15
		return items.slice(start, limit);
	}
}
