import CategoryRepository from "#category/domain/repository/category.repository"
import { Category } from "#category/domain/entities/category"
import { CategoryOutput, CategoryOutputMapper } from "#category/application/dto"
import UseCase from "#seedwork/application/use-case"

export default class CreateCategoryUseCase implements UseCase<Input, Output> {

  constructor(private readonly categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input)
    await this.categoryRepo.insert(entity)
    return CategoryOutputMapper.toOutput(entity)
  }
}

export type Input = {
  name: string
  description?: string
  isActive?: boolean
}

export type Output = CategoryOutput