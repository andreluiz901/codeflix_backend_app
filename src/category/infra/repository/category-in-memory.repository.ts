import { Category } from "#category/domain/entities/category";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
import CategoryRepository from "#category/domain/repository/category.repository";
import { SortDirection } from "#seedwork/domain/repository/repository-contratcs";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository {

  sortableFields: string[] = ['name', 'createdAt']

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items
    }

    return items.filter(i => {
      return i.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: Category[],
    sort: string | null,
    sortDir: SortDirection | null): Promise<Category[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}