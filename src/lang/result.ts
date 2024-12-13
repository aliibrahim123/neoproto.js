import type { Predicate } from "../common/types.ts";
import type { Option } from "./option.ts";

export class Result <T, E> {
	_ok: T;
	_err: E;
	constructor (ok: T | undefined, err: E | undefined) {
		this._ok = ok as T;
		this._err = err as E;
	}

	get isOk () { return this._err === undefined }
	get isErr () { return this._err !== undefined }

	isOkAnd (predicate: Predicate<T>) { return this.isOk && predicate(this._ok) }
	isErrAnd (predicate: Predicate<E>) { return this.isErr && predicate(this._err) }

	unwrap () { return this._ok }
	unwrapErr () { return this._err }
	unwrapOr (Default: T) { return this.isOk ? this._ok : Default }
	unwrapElse (Default: () => T) { return this.isOk ? this._ok : Default() }

	map <U> (mapper: (value: T) => U) {
		if (this.isOk) return new Result<U, E>(mapper(this._ok), undefined);
		return new Result<U, E>(undefined, this._err);
	}
	mapErr <F> (mapper: (error: E) => F) {
		if (this.isErr) return new Result<T, F>(undefined, mapper(this._err));
		return new Result<T, F>(this._ok, undefined);
	}
	mapOr <U> (mapper: (value: T) => U, Default: U) {
		return this.isOk ? mapper(this._ok) : Default; 
	}
	mapElse <U> (mapper: (value: T) => U, Default: () => U) {
		return this.isOk ? mapper(this._ok) : Default(); 
	}

	inspect (inspector: (value: T) => void) {
		if (this.isOk) inspector(this._ok);
		return this;
	}
	inspectErr (inspector: (error: E) => void) {
		if (this.isErr) inspector(this._err);
		return this;
	}

	throw () {
		if (this.isErr) throw this._err;
		return this
	}

	and <U> (other: Result<U, E>) {
		return this.isOk ? other : new Result<U, E>(undefined, this._err);
	}
	andThen <U> (other: () => Result<U, E>) {
		return this.isOk ? other() : new Result<U, E>(undefined, this._err);
	}

	or (other: Result<T, E>) {
		return this.isOk ? this : other
	}
	orElse (other: () => Result<T, E>) {
		return this.isOk ? this : other()
	}

	flattern (): T extends Result<infer R, E> ? Result<R, E> : never {
		if (this.isOk && this._ok instanceof Result) return this._ok as ReturnType<(typeof this.flattern)>;
		return undefined as unknown as ReturnType<(typeof this.flattern)>;
	}
}

// iterator
export interface Result <T, E> {
	[Symbol.iterator] (): T extends Iterable<infer I> ? Iterator<I> : never;
}
Result.prototype[Symbol.iterator] = function* (this: Result<Iterable<any>, any>) {
	if (this.isErr) return;
	if (this._ok?.[Symbol.iterator]) 
		for (const item of this._ok) yield item;
}

//option extentions
export interface Result <T, E> {
	ok (): Option<T>;
	err (): Option<E>;
}

export function Ok <T, E> (value: T) { return new Result<T, E>(value, undefined) }
export function Err <T, E> (err: E) { return new Result<T, E>(undefined, err) }

Object.defineProperty(Ok, Symbol.hasInstance, {
	value: (instance: Result<any, any>) => instance?.isOk
});
Object.defineProperty(Err, Symbol.hasInstance, {
	value: (instance: Result<any, any>) => instance?.isErr
});

export function from <T, E, args extends any[]> (fn: (...args: args) => T, ...args: args) {
	try {
		return new Result<T, E>(fn(...args), undefined)
	} catch (err: unknown) {
		return new Result<T, E>(undefined, err as E)
	}
}

export async function fromAsync <T, E, args extends any[]> (
	fn: (...args: args) => Promise<T>, ...args: args
) {
	try {
		return new Result<T, E>(await fn(...args), undefined)
	} catch (err: unknown) {
		return new Result<T, E>(undefined, err as E)
	}
}

export function partition <T, E> (inp: Result<T, E>[]) {
	var result: { ok: T[], err: E[] } = { ok: [], err: [] }
	for (const item of inp) 
		item.isOk ? result.ok.push(item._ok) : result.err.push(item._err)
	return result
}