import { KType } from "./ktype";
import { KObject } from "./object";
import {
	BooleanType,
	EmailType,
	NumberType,
	ObjectType,
	StringType,
} from "./valueTypes";

export function object<T extends ObjectType>(obj: T) {
	return new KObject<typeof obj>(obj);
}

export function string() {
	return new StringType();
}

export function email() {
	return new EmailType();
}

export function number() {
	return new NumberType();
}

export function boolean() {
	return new BooleanType();
}

export type TypeOf<T extends KType<any>> = T["output"];
export type TypeOfObject<T extends ObjectType> = {
	[key in keyof T]: TypeOf<T[key]>;
};
export type { TypeOf as getType };
