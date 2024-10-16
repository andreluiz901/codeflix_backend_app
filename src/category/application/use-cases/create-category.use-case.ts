import CategoryRepository from "category/domain/repository/category.repository"
import { Category } from "../../../category/domain/entities/category"

export default class CreateCategoryUseCase {

  constructor(private readonly categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input)
    await this.categoryRepo.insert(entity)
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
  name: string
  description?: string
  isActive?: boolean
}

export type Output = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
}

