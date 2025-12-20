import { AppError } from "../app-error";

export class Success<T, E> {
    public readonly isSuccess = true as const;
    public readonly isFailure = false as const;
    public readonly error = null;
    constructor(private readonly _value: T) { }
    public getValue(): T { return this._value; }
}

export class Failure<T, E> {
    public readonly isSuccess = false as const;
    public readonly isFailure = true as const;
    public readonly error: E;
    constructor(error: E) { this.error = error; }
    public getValue(): T {
        throw new Error("Can't get the value of an error result. Use 'error' instead.");
    }
}

export type Result<T, E = AppError> = Success<T, E> | Failure<T, E>;

export const Result = {
    ok: <T, E = AppError>(value: T): Result<T, E> => new Success(value),
    fail: <T, E = AppError>(error: E): Result<T, E> => new Failure(error)
};
