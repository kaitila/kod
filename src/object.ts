import { KodError } from "./error";
import { KType } from "./ktype";
import { TypeOfObject } from "./types";
import { KError, ObjectType } from "./valueTypes";

export interface ParseReturnObject<T> {
	data?: T;
	error?: KError[];
}

export class KObject<T extends ObjectType> extends KType<TypeOfObject<T>> {
	readonly output!: TypeOfObject<T>;
	obj: T;

	constructor(obj: T) {
		super();
		this.obj = obj;
	}

	get(key: keyof T) {
		return this.obj[key];
	}

	parse(value: { [key in keyof T]: unknown }): ParseReturnObject<
		TypeOfObject<T>
	> {
		const errors: KError[] = [];

		Object.keys(this.obj).map((key) => {
			/*  if (!value[key]) {
				errors.push(KodError.new("key_undefined", "", key));
			} */

			const { error } = this.get(key).parse(value[key]);
			if (error) {
				errors.push({ ...error, key: key });
			}
		});

		if (errors.length > 0) {
			return {
				error: errors,
			};
		}

		return {
			data: value as TypeOfObject<T>,
		};
	}
}
