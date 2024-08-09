import { KObject } from "./KObject";
import { KodError } from "./KodError";
import { KError, KObjectProps, ObjectType, ValueClassProps } from "./types";
import { StringType, NumberType, BooleanType } from "./valueTypes";

export function object<T extends ObjectType>(obj: T, props?: KObjectProps) {
	return new KObject<typeof obj>(obj, props || {});
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
