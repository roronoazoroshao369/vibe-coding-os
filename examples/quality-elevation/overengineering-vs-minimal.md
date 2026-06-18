# Before / After: Overengineering vs Minimal

## Task

Validate that an email string is non-empty and contains `@`.

## Overengineered version

```ts
abstract class Validator<T> {
  abstract validate(value: T): ValidationResult;
}

class ValidationResult {
  constructor(
    public readonly valid: boolean,
    public readonly errors: string[] = []
  ) {}
}

class EmailValidationStrategy extends Validator<string> {
  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim().length === 0) {
      errors.push("Email is required");
    }

    if (!value.includes("@")) {
      errors.push("Email must contain @");
    }

    return new ValidationResult(errors.length === 0, errors);
  }
}

class ValidatorFactory {
  static create(type: "email"): Validator<string> {
    switch (type) {
      case "email":
        return new EmailValidationStrategy();
    }
  }
}

const validator = ValidatorFactory.create("email");
const result = validator.validate(email);
```

This adds an abstract class, a result object, a strategy class, and a factory for one simple validation rule.

## Minimal version

```ts
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length > 0 && trimmed.includes("@");
}
```

If the caller needs an error message:

```ts
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();

  if (trimmed.length === 0) return "Email is required";
  if (!trimmed.includes("@")) return "Email must contain @";

  return null;
}
```

## Why minimal is better here

The overengineered version optimizes for imagined future complexity. It creates more files or concepts to understand, more surface area for bugs, and more code to maintain.

The minimal version solves the stated problem directly. It is easy to test, easy to read, and easy to replace if requirements later become more complex.

## YAGNI principle

YAGNI means "You Aren't Gonna Need It." Do not build abstractions for future requirements that do not exist yet. Add structure when real complexity appears, not before.
