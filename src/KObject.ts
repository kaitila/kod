import { defaultMessages } from "./const";
import { KodError } from "./KodError";
import { KType } from "./KType";
import { newError } from "./methods";
import { KObjectProps, TypeOfObject } from "./types";
import { KError, ObjectType, ParseReturn } from "./types";

export class KObject<T extends ObjectType> extends KType<TypeOfObject<T>> {
	readonly output!: TypeOfObject<T>;
	obj: T;
	undefinedMessage: string;

	constructor(obj: T, { undefinedMessage }: KObjectProps) {
		super();
		this.obj = obj;
		this.undefinedMessage =
			undefinedMessage || defaultMessages.undefinedMessage;
	}

	get(key: keyof T) {
		return this.obj[key];
	}

	parse(value: { [key: string]: unknown }): ParseReturn<TypeOfObject<T>> {
		const errorArr: KError[] = [];

		Object.keys(this.obj).map((key) => {
			if (value[key] === undefined) {
				errorArr.push(
					KodError.new(
						"key_undefined",
						this.get(key).undefinedMessage,
						`/${key}`
					)
				);
				return;
			}

			const { error } = this.get(key).parse(value[key]);
			console.log(error?.items);
			if (error) {
				error.items.map((item) => {
					errorArr.push({
						...item,
						path: `/${key}${item.path}`,
					});
				});
			}
		});

		if (errorArr.length > 0) {
			return {
				error: newError(errorArr),
			};
		}

		return {
			data: value as TypeOfObject<T>,
		};
	}
}
