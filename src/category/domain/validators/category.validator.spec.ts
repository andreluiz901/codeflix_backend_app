import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from "./category.validator"

describe('CategoryValidator tests', () => {

  let validator: CategoryValidator

  beforeEach(() => {
    validator = CategoryValidatorFactory.create()
  })

  test('invalidation cases in name fields', () => {

    expect({ validator, data: null }).containsErrorsMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { name: null } }).containsErrorsMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { name: "" } }).containsErrorsMessages({
      name: [
        'name should not be empty',
      ]
    })

    expect({ validator, data: { name: 5 as any } }).containsErrorsMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { name: 't'.repeat(256) } }).containsErrorsMessages({
      name: [
        'name must be shorter than or equal to 255 characters'
      ]
    })
  })

  test('invalidation cases for description fields', () => {
    expect({ validator, data: { description: 5 } }).containsErrorsMessages({
      description: [
        "description must be a string"
      ]
    })
  })

  test("invalidation cases for isActive field", () => {
    expect({ validator, data: { isActive: 5 } }).containsErrorsMessages({
      isActive: ["isActive must be a boolean value"],
    });

    expect({ validator, data: { isActive: 0 } }).containsErrorsMessages({
      isActive: ["isActive must be a boolean value"],
    });

    expect({ validator, data: { isActive: 1 } }).containsErrorsMessages({
      isActive: ["isActive must be a boolean value"],
    });

    expect({ validator, data: { isActive: 'true' } }).containsErrorsMessages({
      isActive: ["isActive must be a boolean value"],
    });

    expect({ validator, data: { isActive: 'false' } }).containsErrorsMessages({
      isActive: ["isActive must be a boolean value"],
    });
  });

  test('valid cases for fields', () => {

    const arrange: Array<{ name: string; description?: string | null; isActive?: boolean }> = [
      { name: 'some value' },
      { name: 'some value', description: undefined },
      { name: 'some value', description: null },
      { name: 'some value', isActive: true },
      { name: 'some value', isActive: false }
    ]

    arrange.forEach(item => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new CategoryRules((item)))
    })
  })
})