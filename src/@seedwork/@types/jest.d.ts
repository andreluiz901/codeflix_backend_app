import { FieldsErrors } from "@seedwork/domain/validators/validator-fileds-interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorsMessages: (expected: FieldsErrors) => R
    }
  }
}

export { }