import { KodType } from "./KodType";
import { KodError } from "./KodError";

export type ObjectType = {
	[key: string]: KodType<any>;
};

export interface KError {
	code: string;
	message: string;
	path: string[];
}

export interface RefineError {
	message?: string;
	path?: string[];
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

export interface KodObjectProps {
	undefinedMessage?: string;
}

export type RefineFunction<T> = (values: T) => any;

export type TypeOf<T extends KodType<any>> = T["output"];
export type TypeOfObject<T extends ObjectType> = {
	[key in keyof T]: TypeOf<T[key]>;
};
