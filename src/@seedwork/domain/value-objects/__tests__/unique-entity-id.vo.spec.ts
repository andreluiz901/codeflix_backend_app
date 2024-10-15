import { validate as uuidValidate } from "uuid"
import InvalidUuidError from "../../errors/invalid-uuid.error"
import UniqueEntityId from "../unique-entity-id.vo"

describe('Unique entity id unit tests', () => {

  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate")

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('fake id')).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const uuid = '42002e24-baea-41a7-9da2-6464319bc9c6'
    const vo = new UniqueEntityId(uuid)
    expect(vo.value).toBe(uuid)
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const vo = new UniqueEntityId()
    expect(uuidValidate(vo.value)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalled()
  })
})