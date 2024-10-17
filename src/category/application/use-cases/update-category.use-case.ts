import CategoryRepository from "#category/domain/repository/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "#category/application/dto/category-output"
import UseCase from "#seedwork/application/use-case"

export default class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id)
    entity.update(input.name, input.description)

    if (input.isActive === true) {
      entity.activate()
    }

    if (input.isActive === false) {
      entity.deactivate()
    }

    await this.categoryRepo.update(entity)
    return CategoryOutputMapper.toOutput(entity)
  }
}

export type Input = {
  id: string
  name: string
  description?: string
  isActive?: boolean
}

export type Output = CategoryOutput