import { defaultMessages } from "./const";
import { KodError } from "./KodError";
import { KodType } from "./KodType";
import { newError } from "./methods";
import { EMAIL_REGEX, PASSWORD_REGEX } from "./regex";
import { KError, ParseReturn, ValueClassProps } from "./types";

export abstract class ValueType<T> extends KodType<T> {
	readonly tsType: string;
	tsTypeMessage: string;
	optionalKey: boolean;
	optionalKeyMessage: string;
	undefinedMessage: string;

	constructor(
		tsType: string,
		{ requiredMessage, typeMessage, undefinedMessage }: ValueClassProps
	) {
		super();
		this.tsType = tsType;
		this.tsTypeMessage = "";
		this.optionalKey = false;
		this.optionalKeyMessage = "";

		this.optionalKeyMessage =
			requiredMessage || defaultMessages.requiredMessage;
		this.undefinedMessage =
			undefinedMessage || defaultMessages.undefinedMessage;
		this.tsTypeMessage = typeMessage || defaultMessages.typeMessage;
	}

	optional() {
		this.optionalKey = true;
		return this;
	}

	isTsType(value: unknown) {
		return typeof value === this.tsType;
	}

	isDefined(value: unknown) {
		return (
			value !== 0 && value !== "" && value !== null && value !== undefined
		);
	}

	parseCommons(value: unknown): ParseReturn<T> {
		const errors: KError[] = [];
		if (!this.optionalKey && !this.isDefined(value)) {
			return {
				error: newError([
					KodError.new("is_required", this.optionalKeyMessage),
				]),
			};
		}

		if (!this.isTsType(value)) {
			return {
				error: newError([
					KodError.new("invalid_type", this.tsTypeMessage),
				]),
			};
		}

		return {};
	}
}

export class StringType extends ValueType<string> {
	maxLength = 0;
	minLength = 0;
	emailKey = false;
	maxLengthMessage = "";
	minLengthMessage = "";
	emailMessage = "";
	passKey = false;
	passMessage = "";

	constructor(props?: ValueClassProps) {
		super("string", props || {});
		this.maxLength = 30;
		this.minLength = 0;
		this.maxLengthMessage = "";
		this.minLengthMessage = "";
	}

	pass(message?: string) {
		this.passKey = true;
		this.passMessage = message || "";
		return this;
	}

	email(message?: string) {
		this.emailKey = true;
		this.emailMessage = message || "";
		return this;
	}

	max(val: number, message?: string) {
		this.maxLength = val;
		this.maxLengthMessage = message || "";
		return this;
	}

	min(val: number, message?: string) {
		this.minLength = val;
		this.minLengthMessage = message || "";
		return this;
	}

	parse(value: unknown): ParseReturn<string> {
		const { error } = this.parseCommons(value);
		if (error) {
			return { error };
		}

		const typedValue = value as string;

		if (this.emailKey && !this.isEmail(typedValue)) {
			return {
				error: newError([KodError.new("not_email", this.emailMessage)]),
			};
		}

		if (this.passKey && !this.isPass(typedValue)) {
			return {
				error: newError([KodError.new("not_pass", this.passMessage)]),
			};
		}

		if (!this.isMinLength(typedValue)) {
			return {
				error: newError([
					KodError.new("too_short", this.minLengthMessage),
				]),
			};
		}

		if (!this.isMaxLength(typedValue)) {
			return {
				error: newError([
					KodError.new("too_long", this.maxLengthMessage),
				]),
			};
		}

		return {
			data: typedValue,
		};
	}

	isMinLength(value: string) {
		return value.length >= this.minLength;
	}

	isMaxLength(value: string) {
		return value.length <= this.maxLength;
	}

	isEmail(value: string) {
		return EMAIL_REGEX.test(value);
	}

	isPass(value: string) {
		return PASSWORD_REGEX.test(value);
	}
}

export class NumberType extends ValueType<number> {
	minVal: number;
	maxVal: number;
	minValMessage = "";
	maxValMessage = "";
	constructor(props?: ValueClassProps) {
		super("number", props || {});
		this.maxVal = 0;
		this.minVal = 0;
	}

	max(val: number, message: string) {
		this.maxVal = val;
		this.maxValMessage = message || "";
		return this;
	}

	min(val: number, message: string) {
		this.minVal = val;
		this.minValMessage = message || "";
		return this;
	}

	parse(value: unknown): ParseReturn<number> {
		const { error } = this.parseCommons(value);
		if (error) {
			return { error };
		}

		const typedValue = value as number;
		if (!this.isMinValue(typedValue)) {
			return {
				error: newError([
					KodError.new("too_small", this.minValMessage),
				]),
			};
		}

		if (!this.isMaxValue(typedValue)) {
			return {
				error: newError([
					KodError.new("too_large", this.maxValMessage),
				]),
			};
		}

		return {
			data: typedValue,
		};
	}

	isMinValue(value: number) {
		return value >= this.minVal;
	}

	isMaxValue(value: number) {
		if (this.maxVal > 0) {
			return value <= this.maxVal;
		}

		return true;
	}
}

export class BooleanType extends ValueType<boolean> {
	constructor(props?: ValueClassProps) {
		super("boolean", props || {});
	}

	parse(value: unknown): ParseReturn<boolean> {
		const { error } = this.parseCommons(value);
		if (error) {
			return {
				error,
			};
		}

		return {
			data: value as boolean,
		};
	}
}
