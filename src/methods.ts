import { KodObject } from "./KodObject";
import { KodError } from "./KodError";
import { KError, KodObjectProps, ObjectType, ValueClassProps } from "./types";
import { StringType, NumberType, BooleanType } from "./valueTypes";

export function object<T extends ObjectType>(obj: T, props?: KodObjectProps) {
	return new KodObject<typeof obj>(obj, props || {});
}

export function string(props?: ValueClassProps) {
	return new StringType(props);
}

export function number(props?: ValueClassProps) {
	return new NumberType(props);
}

export function boolean(props?: ValueClassProps) {
	return new BooleanType(props);
}

export function newError(items: KError[]) {
	return new KodError(items);
}

export type { TypeOf as type } from "./types";
