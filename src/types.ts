import { KType } from "./KType";
import { StringType, NumberType, BooleanType } from "./valueTypes";
import { KodError } from "./KodError";

export type ObjectType = {
	[key: string]: KType<any>;
};

export interface KError {
	code: string;
	message: string;
	path: string;
}

export interface KErrorFormat {
	[key: string]: KErrorFormat | string;
}

export interface KErrorFlatten {
	[key: string]: string;
}

export interface ParseReturn<T> {
	data?: T;
	error?: KodError;
}

export interface ValueClassProps {
	requiredMessage?: string;
	typeMessage?: string;
	undefinedMessage?: string;
}

export type DefaultMessages = {
	[key in keyof ValueClassProps]-?: string;
};

export interface KObjectProps {
	undefinedMessage?: string;
}

export type TypeOf<T extends KType<any>> = T["output"];
export type TypeOfObject<T extends ObjectType> = {
	[key in keyof T]: TypeOf<T[key]>;
};
