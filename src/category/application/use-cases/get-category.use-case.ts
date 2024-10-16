import CategoryRepository from "category/domain/repository/category.repository"
import { CategoryOutput } from "../dto/category-output.dto"
import UseCase from "../../../@seedwork/application/use-case"

export default class GetCategoryUseCase implements UseCase<Input, Output> {

  constructor(private readonly categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id)
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt
    }
  }
}

export type Input = {
  id: string
}

export type Output = CategoryOutput