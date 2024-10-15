import { ClassValidatorFields } from "../class-validator-fields"
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{ field: string }> { }

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize erros and validated data variables on null', () => {
    const validator = new StubClassValidatorFields()
    expect(validator.errors).toBeNull()
    expect(validator.validatedData).toBeNull()
  })

  it('should validate with errors', () => {
    const sypValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    sypValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'some error' } }
    ])
    const validator = new StubClassValidatorFields()
    expect(validator.validate(null)).toBeFalsy()
    expect(sypValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toBeNull()
    expect(validator.errors).toStrictEqual({ field: ['some error'] })
  })

  it('should validate without errors', () => {
    const sypValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    sypValidateSync.mockReturnValue([])
    const validator = new StubClassValidatorFields()
    expect(validator.validate({ field: 'value' })).toBeTruthy()
    expect(sypValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toStrictEqual({ field: 'value' })
    expect(validator.errors).toBeNull()
  })
})