import { KError, KErrorFlatten, KErrorFormat } from "./types";

export class KodError {
	items: KError[];

	constructor(items: KError[]) {
		this.items = items;
	}

	format(): KErrorFormat {
		let returnObj: KErrorFormat = {};
		this.items.map((item) => {
			if (item.path) {
				returnObj = createPath(returnObj, item.path, item.message);
			}
		});

		return returnObj;
	}

	flatten(): KErrorFlatten {
		let returnObj: KErrorFlatten = {};
		this.items.map((item) => {
			if (item.path) {
				returnObj[item.path.pop()!] = item.message;
			}
		});
		return returnObj;
	}

	static new(code: string, message: string, path: string[] = []): KError {
		return {
			code,
			message,
			path,
		};
	}

	static newRefine(message: string = "", path: string[] = []): KError {
		return KodError.new("refine", message, path);
	}
}

const createPath = (
	obj: KErrorFormat,
	path: string[],
	message: string = ""
) => {
	let pathArr = path;
	let current = obj;

	while (pathArr.length > 1) {
		const [head, ...tail] = pathArr;
		pathArr = tail;
		if (current[head] === undefined) {
			current[head] = {};
		}
		current = current[head] as KErrorFormat;
	}

	current[pathArr[0]] = message;
	return obj;
};
