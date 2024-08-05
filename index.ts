import { k } from "./src";

const test = k.object({
	name: k.string().min(2, "too short"),
	age: k.string().max(5, "asd"),
});

type TestType = k.getType<typeof test>;

const test2 = k.string().min(4, "string is too short").max(10);

const { data, error } = test.parse({
	name: "asd",
	age: "dsaf",
});

console.log(error, data);
