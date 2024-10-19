import { expect } from 'expect';
import {
	ClassValidatorFields,
	EntityValidationError,
	FieldsErrors,
} from '#seedwork/domain/';

type Expected =
	| { validator: ClassValidatorFields<any>; data: any }
	| (() => any);

expect.extend({
	containsErrorsMessages(expected: Expected, received: FieldsErrors) {
		if (typeof expected === 'function') {
			try {
				expected();
				return isValid();
			} catch (e) {
				const error = e as EntityValidationError;
				return assertContainsErrorsMessages(error.error, received);
			}
		} else {
			const { validator, data } = expected;
			const validated = validator.validate(data);

			if (validated) {
				return isValid();
			}

			return assertContainsErrorsMessages(validator.errors, received);
		}
	},
});

function isValid() {
	return { pass: true, message: () => '' };
}

function assertContainsErrorsMessages(
	expected: FieldsErrors,
	received: FieldsErrors,
) {
	const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

	return isMatch
		? { pass: true, message: () => '' }
		: {
				pass: false,
				message: () =>
					`The validation errors do not contain ${JSON.stringify(
						received,
					)}. Current: ${JSON.stringify(expected)}`,
			};
}
