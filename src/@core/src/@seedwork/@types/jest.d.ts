import { FieldsErrors } from '#seedwork/domain';

declare global {
	namespace jest {
		interface Matchers<R> {
			containsErrorsMessages: (expected: FieldsErrors) => R;
		}
	}
}
