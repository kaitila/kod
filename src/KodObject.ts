import { defaultMessages } from "./const";
import { KodError } from "./KodError";
import { KodType } from "./KodType";
import { newError } from "./methods";
import {
	KodObjectProps,
	RefineError,
	RefineFunction,
	TypeOfObject,
} from "./types";
import { KError, ObjectType, ParseReturn } from "./types";

export class KodObject<T extends ObjectType> extends KodType<TypeOfObject<T>> {
	readonly output!: TypeOfObject<T>;
	obj: T;
	undefinedMessage: string;
	refineFunction: RefineFunction<TypeOfObject<T>> = (
		values: TypeOfObject<T>
	) => {
		return true;
	};
	refineError: RefineError = {};

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
						[key]
					)
				);
				return;
			}

			const { error } = this.get(key).parse(value[key]);
			if (error) {
				error.items.map((item) => {
					errorArr.push({
						...item,
						path: [key, ...item.path],
					});
				});
			}
		});

		const typedValue = value as TypeOfObject<T>;

		if (
			!this.refineFunction(typedValue) &&
			!errorArr.find(
				(item) =>
					item.path.toString() == this.refineError.path?.toString()
			)
		) {
			errorArr.push(
				KodError.newRefine(
					this.refineError.message,
					this.refineError.path
				)
			);
		}

		if (errorArr.length > 0) {
			return {
				error: newError(errorArr),
			};
		}

		return {
			data: typedValue,
		};
	}

	refine(validator: RefineFunction<TypeOfObject<T>>, error: RefineError) {
		this.refineFunction = validator;
		this.refineError = error;
		return this;
	}
}
