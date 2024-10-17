import { CreateCategoryUseCase } from "#category/application/use-cases/create-category.use-case"
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository"

describe('CreateCategoryUseCase Unit Test', () => {
  let useCase: CreateCategoryUseCase.UseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new CreateCategoryUseCase.UseCase(repository)
  })

  it('should create a category', async () => {
    let spyInsert = jest.spyOn(repository, 'insert')
    let output = await useCase.execute({ name: 'test' })
    expect(spyInsert).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: 'test',
      description: null,
      isActive: true,
      createdAt: repository.items[0].createdAt
    })

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      isActive: false
    })
    expect(spyInsert).toHaveBeenCalledTimes(2)
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: 'test',
      description: 'some description',
      isActive: false,
      createdAt: repository.items[1].createdAt
    })
  })
})