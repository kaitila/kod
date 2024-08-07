import { KObject } from "./KObject";
import { ObjectType, ValueClassProps } from "./types";
import { StringType, NumberType, BooleanType } from "./valueTypes";

export function object<T extends ObjectType>(obj: T) {
	return new KObject<typeof obj>(obj);
}

export function string(props: ValueClassProps) {
	return new StringType(props);
}

export function number(props: ValueClassProps) {
	return new NumberType(props);
}

export function boolean(props: ValueClassProps) {
	return new BooleanType(props);
}

export type { TypeOf as type } from "./types";
