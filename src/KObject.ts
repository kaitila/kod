import { KType } from "./KType";
import { TypeOfObject } from "./types";
import { KError, ObjectType, ParseReturn } from "./types";

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

	parse(value: { [key in keyof T]: unknown }): ParseReturn<TypeOfObject<T>> {
		const errorArr: KError[] = [];

		Object.keys(this.obj).map((key) => {
			/*  if (!value[key]) {
				errors.push(KodError.new("key_undefined", "", key));
			} */

			const { errors } = this.get(key).parse(value[key]);
			if (errors) {
				errorArr.push({ ...errors[0], key: `${key}` });
			}
		});

		if (errorArr.length > 0) {
			return {
				errors: errorArr,
			};
		}

		return {
			data: value as TypeOfObject<T>,
		};
	}
}
