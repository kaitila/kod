import { KodError } from "./error";
import { KType } from "./ktype";
import { TypeOf } from "./types";

export type ValueType = StringType | EmailType | NumberType | BooleanType;
export type ObjectType = {
	[key: string]: ValueType;
};

export interface KError {
	code: string;
	message: string;
	key?: string;
}

export interface ParseReturn<T> {
	data?: T;
	error?: KError;
}

export interface ValueClassProps {
	requiredMessage?: string;
	typeMessage?: string;
}

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
		if (!this.optionalKey && !this.isDefined(value)) {
			return {
				error: KodError.new("is_required", this.optionalKeyMessage),
			};
		}

		if (!this.isTsType(value)) {
			return {
				error: KodError.new("invalid_type", this.tsTypeMessage),
			};
		}

		return {};
	}
}

export class StringType extends ValueTypeDef<string> {
	maxLength: number;
	minLength: number;
	maxLengthMessage: string;
	minLengthMessage: string;

	constructor(props?: ValueClassProps) {
		super("string", props || {});
		this.maxLength = 30;
		this.minLength = 0;
		this.maxLengthMessage = "";
		this.minLengthMessage = "";
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

		if (!this.isMinLength(typedValue)) {
			return {
				error: KodError.new("too_short", this.minLengthMessage),
			};
		}

		if (!this.isMaxLength(typedValue)) {
			return {
				error: KodError.new("too_long", this.maxLengthMessage),
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
}

export class NumberType extends ValueTypeDef<number> {
	minVal: number;
	maxVal: number;
	constructor(props?: ValueClassProps) {
		super("number", props || {});
		this.maxVal = 30;
		this.minVal = 0;
	}

	max(val: number) {
		this.maxVal = val;
		return this;
	}

	min(val: number) {
		this.minVal = val;
		return this;
	}

	parse(): ParseReturn<number> {
		return {};
	}
}

export class EmailType extends ValueTypeDef<string> {
	maxLength: number;
	minLength: number;
	constructor(props?: ValueClassProps) {
		super("string", props || {});
		this.maxLength = 30;
		this.minLength = 0;
	}

	max(val: number) {
		this.maxLength = val;
		return this;
	}

	min(val: number) {
		this.minLength = val;
		return this;
	}

	parse(): ParseReturn<string> {
		return {};
	}
}

export class BooleanType extends ValueTypeDef<boolean> {
	constructor(props?: ValueClassProps) {
		super("boolean", props || {});
	}

	parse(): ParseReturn<boolean> {
		return {};
	}
}
