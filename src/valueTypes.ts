import { KodError } from "./KodError";
import { KType } from "./KType";
import { EMAIL_REGEX, PASSWORD_REGEX } from "./regex";
import { KError, ParseReturn, ValueClassProps } from "./types";

export abstract class ValueTypeDef<T> extends KType<T> {
	readonly tsType: string;
	tsTypeMessage: string;
	optionalKey: boolean;
	optionalKeyMessage: string;

	constructor(
		tsType: string,
		{ requiredMessage, typeMessage }: ValueClassProps
	) {
		super();
		this.tsType = tsType;
		this.tsTypeMessage = "";
		this.optionalKey = false;
		this.optionalKeyMessage = "";

		if (requiredMessage) {
			this.optionalKeyMessage = requiredMessage;
		}
		if (typeMessage) {
			this.tsTypeMessage = typeMessage;
		}
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
				errors: [KodError.new("is_required", this.optionalKeyMessage)],
			};
		}

		if (!this.isTsType(value)) {
			return {
				errors: [KodError.new("invalid_type", this.tsTypeMessage)],
			};
		}

		return {};
	}
}

export class StringType extends ValueTypeDef<string> {
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
		const { errors } = this.parseCommons(value);
		if (errors) {
			return { errors };
		}

		const typedValue = value as string;

		if (this.emailKey && !this.isEmail(typedValue)) {
			return {
				errors: [KodError.new("not_email", this.emailMessage)],
			};
		}

		if (this.passKey && !this.isPass(typedValue)) {
			return {
				errors: [KodError.new("not_pass", this.passMessage)],
			};
		}

		if (!this.isMinLength(typedValue)) {
			return {
				errors: [KodError.new("too_short", this.minLengthMessage)],
			};
		}

		if (!this.isMaxLength(typedValue)) {
			return {
				errors: [KodError.new("too_long", this.maxLengthMessage)],
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

export class NumberType extends ValueTypeDef<number> {
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
		const { errors } = this.parseCommons(value);
		if (errors) {
			return { errors };
		}

		const typedValue = value as number;
		if (!this.isMinValue(typedValue)) {
			return {
				errors: [KodError.new("too_small", this.minValMessage)],
			};
		}

		if (!this.isMaxValue(typedValue)) {
			return {
				errors: [KodError.new("too_large", this.maxValMessage)],
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

export class BooleanType extends ValueTypeDef<boolean> {
	constructor(props?: ValueClassProps) {
		super("boolean", props || {});
	}

	parse(value: unknown): ParseReturn<boolean> {
		const { errors } = this.parseCommons(value);
		if (errors) {
			return {
				errors,
			};
		}

		return {
			data: value as boolean,
		};
	}
}
