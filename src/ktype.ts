import { ParseReturn } from "./types";

export abstract class KType<T> {
	readonly output!: T;
	undefinedMessage!: string;

	parse(value: unknown): ParseReturn<T> {
		return {};
	}
}
