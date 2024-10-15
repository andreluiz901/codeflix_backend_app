import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validators/class-validator-fields"
import ValidatorFieldsInterface from "../../../@seedwork/domain/validators/validator-fileds-interface";
import { CategoryProperties } from "../entities/category";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  isActive: string

  @IsDate()
  @IsOptional()
  createdAt: Date

  constructor({ name, description, isActive, createdAt }: CategoryProperties) {
    Object.assign(this, { name, description, isActive, createdAt })
  }
}

export class CategoryValidator
  extends ClassValidatorFields<CategoryRules>
  implements ValidatorFieldsInterface<CategoryRules> {
  validate(data: CategoryProperties): boolean {
    return super.validate(new CategoryRules(data ?? {} as any))
  }
}


export default class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}
