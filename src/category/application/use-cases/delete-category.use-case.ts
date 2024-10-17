import UseCase from "@seedwork/application/use-case";
import CategoryRepository from "category/domain/repository/category.repository";

export class DeleteCategoryUseCase implements UseCase<Input, void> {

  constructor(private readonly categoryRepository: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<void> {
    const entity = await this.categoryRepository.findById(input.id)
    await this.categoryRepository.delete(entity.id)
  }
}

export default DeleteCategoryUseCase

export type Input = {
  id: string
}