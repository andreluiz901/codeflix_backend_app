import { deepFreeze } from '#seedwork/domain/utils/object';

export abstract class ValueObject<Value = any> {
	protected readonly _value: Value;

	constructor(value: Value) {
		this._value = deepFreeze(value);
	}

	get value() {
		return this._value;
	}

	toString = () => {
		if (typeof this._value !== 'object' || this.value === null) {
			try {
				return this.value.toString();
			} catch (e) {
				return `${this._value}`;
			}
		}
		const valueStr = this.value.toString();
		return valueStr === '[object Object]'
			? JSON.stringify(this.value)
			: valueStr;
	};
}

export default ValueObject;
