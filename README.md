# Kod
Lightweight TypeScript schema validation library inspired by Zod.

## Basic usage
Importing

```typescript
import { k } from '@kod';
```

Creating a schema

```typescript
//String
const stringSchema = k.string();

//Number
const numberSchema = k.number();

//Boolean
const booleanSchema = k.boolean();

//Object
const objectSchema = k.object({
  name: k.string(),
  age: k.number(),
});
```

Parsing
```typescript
const stringSchema = k.string();
const { data, errors } = stringSchema.parse('test string');
```

## Methods

### string()
Supported validation parameters for strings:

```typescript
k.string().min(value: number);
k.string().max(value: number);
k.string().email();
k.string().pass();
```

All validation parameters support a second parameter `message: string` that defines a custom error message for the `parse()` function.
```typescript
k.string().min(2, 'String has to be at least 2 characters long.');
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

