import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository"
import ListCategoriesUseCase from "#category/application/use-cases/list-categories.use-case"
import CategoryRepository from "#category/domain/repository/category.repository"
import { Category } from "#category/domain/entities/category"

describe('ListCategoryUseCase Unit Test', () => {
  let useCase: ListCategoriesUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new ListCategoriesUseCase(repository)
  })

  test('toOutput method', () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null
    })
    let output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1
    })

    const entity = new Category({ name: 'Movie' })
    result = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null
    })
    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1
    })
  })

  it('should returns output using empty input with categories ordered by createdAt', async () => {
    const items = [
      new Category({ name: 'test', }),
      new Category({ name: 'test2', createdAt: new Date(new Date().getTime() + 100) }),
    ]
    repository.items = items

    const output = await useCase.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(i => i.toJSON()),
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1
    })
  })

  it('should returns output using pagination, sort and filter', async () => {
    const items = [
      new Category({ name: 'a', }),
      new Category({ name: 'AAA', }),
      new Category({ name: 'AaA', }),
      new Category({ name: 'b', }),
      new Category({ name: 'c', }),
    ]
    repository.items = items

    let output = await useCase.execute({ page: 1, perPage: 2, sort: 'name', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2
    })

    output = await useCase.execute({ page: 2, perPage: 2, sort: 'name', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2
    })

    output = await useCase.execute({ page: 1, perPage: 2, sort: 'name', sortDir: 'desc', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2
    })
  })
})