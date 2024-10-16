import { Category } from "category/domain/entities/category"

export type CategoryOutput = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
}

export class CategoryOutputMapper {
  static toOutput(entity: Category) {
    return entity.toJSON()
  }
}