# Kod
Lightweight TypeScript schema validation library inspired by Zod.

## 1 Basic usage
Importing

```typescript
import { k } from '@kod';
```

Creating a schema

```typescript
//String
const stringSchema = k.string();
```

Parsing

```typescript
const { data, error } = stringSchema.parse('test string');
```

## 2 Basic concepts
### 2.1 Schema creation
A schema object is created by invoking a schema method.

```typescript
//ex
k.string()
```

`ValueType` methods return a corresponding class instance that extends the `ValueType` class.

```typescript
string() => new StringType | number() => new NumberType | boolean() => new BooleanType
```

The `k.object()` method returns a `KodObject` instance.  

Both types of classes extend the common parent class `KodType`,
> i.e. all schema objects extend the `KodType` class.
<br><br/>

#### 2.1.1 Combining schema methods
The most common way of utilizing `kod` is to combine different schema methods to create larger schemas.

```typescript
const exampleSchema = k.object({
  name: k.string(),
  age: k.number(),
});
```  

`kod` also supports nesting multiple objects.

```typescript
const exampleSchema = k.object({
  personalData: k.object({
    name: k.string(),
    age: k.number(),
  }),
});
```
<br><br/>

### 2.2 Type inference
The type for the schema is automatically infered and stored in the `output` property of the generic `KodType` parent class.

```typescript
class KodType<T> {
  readonly output!: T;
}
```

In order to use the infered type yourself, invoke the `type` generic.

```typescript
const schema = k.string();
type SchemaType = k.type<typeof schema>; // SchemaType = string
```
<br><br/>

### 2.3 Parsing schemas
Parsing is done by invoking the `schema.parse()` method with the value to be parsed as the parameter.

```typescript
KodType<T>.parse(value: unknown) => {
  data?: T,
  error?: KodError,
}

k.string().parse('Am I a string?');
/* expected output:
 * {
 *   data: 'Am I a string' as string,
 * }
 */
```

If the given `value` is valid, `error` is `undefined`. If `value` is invalid, `data` is left `undefined`.
> Only `data` or `error` is returned, `never` both.
<br><br/>

#### 2.3.1 Partial parsing
Objects can be parsed partially by accessing its properties via `KodObject.get()`.

```typescript
const exampleSchema = k.object({
  name: k.string(),
  age: k.number(),
});

exampleSchema.get('name').parse('Git Hub');
```
<br><br/>

### 2.3 Validation parameters
Validation parameters are used to refine a schema.

```typescript
// A string schema, with a min length of 2 and a max length of 10.
k.string().min(2).max(6);
```

All validation parameters support a second (or first) parameter `message: string` that defines a custom error message for the `parse()` function.
```typescript
k.string().min(2, 'String has to be at least 2 characters long.');
```

Learn more about validation parameters in [`Schema methods`](#3-schema-methods)
<br><br/>

## 3 Schema methods

### `string()`
Supported validation parameters for strings:

```typescript
k.string().min(value: number);
k.string().max(value: number);
k.string().email();
k.string().pass();
```

#### `min(value: number, message?: string)`
String has to be at least `value` characters long.

#### `max(value: number, message?: string)`
String has to be at most `value` characters long.

#### `email(message?: string)`
Checks the given input against a default email Regex.

#### `pass(message?: string)`
Checks the given input against a default password Regex.
Given input has to include:
- a lowercase letter
- an uppercase letter
- a number
- at least 6 characters

### number()
Supported validation parameters for numbers:

```
k.number().min(value: number)
k.number().max(value: number)
```
