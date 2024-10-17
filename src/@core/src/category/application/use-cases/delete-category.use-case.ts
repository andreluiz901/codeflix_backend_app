import { default as DefaultUseCase } from "#seedwork/application/use-case";
import CategoryRepository from "#category/domain/repository/category.repository";

export namespace DeleteCategoryUseCase {

  export class UseCase implements DefaultUseCase<Input, void> {

    constructor(private readonly categoryRepository: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<void> {
      const entity = await this.categoryRepository.findById(input.id)
      await this.categoryRepository.delete(entity.id)
    }
  }

  export type Input = {
    id: string
  }
}

export default DeleteCategoryUseCase
