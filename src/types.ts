import { KType } from "./KType";
import { KObject } from "./KObject";
import { StringType, NumberType, BooleanType } from "./valueTypes";

export type ValueType = StringType | NumberType | BooleanType;
export type ObjectType = {
	[key: string]: ValueType;
};

export interface KError {
	code: string;
	message: string;
	key: string;
}

export interface ParseReturn<T> {
	data?: T;
	errors?: KError[];
}

export interface ValueClassProps {
	requiredMessage?: string;
	typeMessage?: string;
}

export type TypeOf<T extends KType<any>> = T["output"];
export type TypeOfObject<T extends ObjectType> = {
	[key in keyof T]: TypeOf<T[key]>;
};
