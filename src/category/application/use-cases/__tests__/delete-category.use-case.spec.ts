import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository"
import DeleteCategoryUseCase from "../delete-category.use-case"
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error"
import { Category } from "../../../domain/entities/category"

describe('DeleteCategoryUseCase Unit Test', () => {
  let useCase: DeleteCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID fake id`)
    )
  })

  it('should delete a category', async () => {
    const items = [new Category({ name: 'test' })]
    repository.items = items
    await useCase.execute({ id: items[0].id })
    expect(repository.items).toHaveLength(0)
  })
})