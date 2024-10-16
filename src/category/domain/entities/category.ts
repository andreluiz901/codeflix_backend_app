import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';
import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import CategoryValidatorFactory from '../validators/category.validator';

export type CategoryProperties = {
  name: string,
  description?: string,
  isActive?: boolean,
  createdAt?: Date
}

export class Category extends Entity<CategoryProperties> {

  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id)
    Category.validate(props)
    this.description = this.props.description;
    this.props.isActive = this.props.isActive ?? true;
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  update(name: string, description: string): void {
    Category.validate({ name, description })
    this.name = name
    this.description = description
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }

  activate() {
    this.props.isActive = true
  }

  deactivate() {
    this.props.isActive = false
  }

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get description() {
    return this.props.description
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get isActive() {
    return this.props.isActive
  }

  private set isActive(value: boolean) {
    this.props.isActive = value ?? true;
  }

  get createdAt() {
    return this.props.createdAt
  }
}