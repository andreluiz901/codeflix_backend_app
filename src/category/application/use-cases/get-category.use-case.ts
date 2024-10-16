import CategoryRepository from "category/domain/repository/category.repository"
import { CategoryOutput } from "../dto/category-output.dto"

export default class GetCategoryUseCase {

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