import { KObject } from "./KObject";
import { ObjectType } from "./types";
import { StringType, NumberType, BooleanType } from "./valueTypes";

export function object<T extends ObjectType>(obj: T) {
	return new KObject<typeof obj>(obj);
}

export function string() {
	return new StringType();
}

export function number() {
	return new NumberType();
}

export function boolean() {
	return new BooleanType();
}

export type { TypeOf as type } from "./types";
