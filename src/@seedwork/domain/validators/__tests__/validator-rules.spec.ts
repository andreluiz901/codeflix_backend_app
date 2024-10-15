import { ValidationError } from "../../errors/validation-error"
import ValidatorRules from "../validator-rules"

type Values = {
  value: any,
  property: string,
}

type ExpectedRule = {
  value: any,
  property: string,
  rule: keyof ValidatorRules,
  error: ValidationError,
  params?: any[]
}

function runRule({ value, property, rule, params = [] }: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method: (...args: any[]) => ValidatorRules = (validator[rule] as (...args: any[]) => ValidatorRules);
  method.apply(validator, params);
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).toThrow(expected.error)
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).not.toThrow(expected.error)
}

describe('Validator Rules Unit Tests', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('some value', 'field')
    expect(validator).toBeInstanceOf(ValidatorRules)
    expect(validator['value']).toBe('some value')
    expect(validator['property']).toBe('field')
  })

  test('required validation rule', () => {

    const invalidCasesArrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: '', property: 'field' }
    ]

    const error = new ValidationError('The field is required')
    invalidCasesArrange.forEach(item => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'required', error })
    })

    const validCasesArrange: Values[] = [
      { value: 'test', property: 'field' },
      { value: 5, property: 'field' },
      { value: 0, property: 'field' },
      { value: false, property: 'field' }
    ]

    validCasesArrange.forEach(item => {
      assertIsValid({ value: item.value, property: item.property, rule: 'required', error })
    })
  })

  test('string validation rule', () => {

    const invalidCasesArrange: Values[] = [
      { value: 5, property: 'field' },
      { value: {}, property: 'field' },
      { value: false, property: 'field' }
    ]

    const error = new ValidationError('The field must be a string')
    invalidCasesArrange.forEach(item => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'string', error })
    })

    const validCasesArrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'test', property: 'field' },
    ]

    validCasesArrange.forEach(item => {
      assertIsValid({ value: item.value, property: item.property, rule: 'string', error })
    })
  })

  test('max length validation rule', () => {
    const invalidCasesArrange: Values[] = [
      { value: 'tests', property: 'field' },
    ]

    const error = new ValidationError('The field must be less or equal than 4 characters')
    invalidCasesArrange.forEach(item => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'maxLength', error, params: [4] })
    })

    const validCasesArrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'tests', property: 'field' },
    ]

    validCasesArrange.forEach(item => {
      assertIsValid({ value: item.value, property: item.property, rule: 'maxLength', error, params: [5] })
    })
  })

  test('boolean validation rule', () => {
    const invalidCasesArrange: Values[] = [
      { value: 5, property: 'field' },
      { value: 'true', property: 'field' },
      { value: 'false', property: 'field' },
    ]

    const error = new ValidationError('The field must be a boolean')
    invalidCasesArrange.forEach(item => {
      assertIsInvalid({ value: item.value, property: item.property, rule: 'boolean', error, })
    })

    const validCasesArrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: true, property: 'field' },
      { value: false, property: 'field' },
    ]

    validCasesArrange.forEach(item => {
      assertIsValid({ value: item.value, property: item.property, rule: 'boolean', error, })
    })
  })

  test('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field')
    expect(() => validator.required().string().maxLength(5)).toThrow('The field is required')

    validator = ValidatorRules.values(5, 'field')
    expect(() => validator.required().string().maxLength(5)).toThrow('The field must be a string')

    validator = ValidatorRules.values('test5+', 'field')
    expect(() => validator.required().string().maxLength(5)).toThrow('The field must be less or equal than 5 characters')

    validator = ValidatorRules.values(null, 'field')
    expect(() => validator.required().boolean()).toThrow('The field is required')

    validator = ValidatorRules.values(5, 'field')
    expect(() => validator.required().boolean()).toThrow('The field must be a boolean')
  })

  test('should valid when combine two or more validation rules', () => {
    expect.assertions(0)

    ValidatorRules.values('test', 'field').required().string()
    ValidatorRules.values('tests', 'field').required().string().maxLength(5)

    ValidatorRules.values(true, 'field').required().boolean()
    ValidatorRules.values(false, 'field').required().boolean()
  })

})