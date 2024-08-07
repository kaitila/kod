import { k } from "./src";
import { EMAIL_REGEX, PASSWORD_REGEX } from "./src/regex";

const test = k.object({
	name: k.string().min(2, "too short"),
	age: k.number().min(18),
	email: k.string().email(),
	password: k.string().pass(),
});

type TestType = k.type<typeof test>;

const test2 = k.string().min(4, "string is too short").max(10);

const { data, errors } = test.parse({
	name: "down",
	age: 18,
	email: "dick@john.com",
	password: "shabalamaA2",
});

console.log(data, errors);
