import { KError } from "./valueTypes";

export class KodError {
	static new(code: string, message: string, key?: string): KError {
		return {
			code,
			message,
			key,
		};
	}
}
