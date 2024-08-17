import { defaultMessages } from "./const";
import { KodError } from "./KodError";
import { KodType } from "./KodType";
import { newError } from "./methods";
import { KodObjectProps, TypeOfObject } from "./types";
import { KError, ObjectType, ParseReturn } from "./types";

export class KodObject<T extends ObjectType> extends KodType<TypeOfObject<T>> {
	readonly output!: TypeOfObject<T>;
	obj: T;
	undefinedMessage: string;

	constructor(obj: T, { undefinedMessage }: KodObjectProps) {
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
