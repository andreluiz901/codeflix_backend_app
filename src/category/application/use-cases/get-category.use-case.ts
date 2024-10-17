import CategoryRepository from "#category/domain/repository/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "#category/application/dto"
import UseCase from "#seedwork/application/use-case"

export default class GetCategoryUseCase implements UseCase<Input, Output> {

  constructor(private readonly categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id)
    return CategoryOutputMapper.toOutput(entity)
  }
}

export type Input = {
  id: string
}

export type Output = CategoryOutput