import { ParseReturn } from "./types";

export abstract class KType<T> {
	readonly output!: T;
	undefinedMessage!: string;
	constructor() {}

	parse(value: unknown): ParseReturn<T> {
		return {};
	}
}
