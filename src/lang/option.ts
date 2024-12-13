import type { Result } from "./result.ts";
import type { Predicate } from '../common/types.ts';

export class Option <T> {
	value: T | null;
	constructor (value: T | null) {
		this.value = value
	}

	get isNone () { return this.value === null }
	get isSome () { return this.value !== null }

	isSomeAnd (predicate: Predicate<T>) {
		return this.value !== null && predicate(this.value);
	}
	isNoneOr (predicate: Predicate<T>) {
		return this.value === null || predicate(this.value);
	}

	unwrap () { return this.value as T }
	unwrapOr (Default: T) { return this.value !== null ? this.value : Default }
	unwrapElse (Default: () => T) { return this.value !== null ? this.value : Default() }

	map <U> (mapper: (value: T) => U) {
		return new Option(this.value !== null ? mapper(this.value) : null)
	}
	mapOr <U> (mapper: (value: T) => U, Default: U) {
		return this.value !== null ? mapper(this.value) : Default
	}
	mapElse <U> (mapper: (value: T) => U, Default: () => U) {
		return this.value !== null ? mapper(this.value) : Default()
	}

	filter (predicate: Predicate<T>) {
		if (this.value === null) return new Option(null);
		return new Option(predicate(this.value) ? this.value : null)
	}
	flattern (): T extends Option<any> ? T : never {
		if (this.value instanceof Option) return this.value as any;
		return this as any;
	}

	inspect (inspector: (value: T) => void) {
		this.value !== null && inspector(this.value);
		return this
	}

	and <U> (other: Option<U>) : Option<U> {
		return this.value !== null ? other : new Option<U>(null)
	}
	andThen <U> (other: () => Option<U>) : Option<U> {
		return this.value !== null ? other() : new Option<U>(null)
	}

	or (other: Option<T>) {
		return this.value !== null ? this : other
	}
	orElse (other: () => Option<T>) {
		return this.value !== null ? this : other()
	}

	xor (other: Option<T>) {
		if (this.value !== null && other.value === null) return this;
		if (this.value === null && other.value !== null) return other;
		return new Option(null)
	}
}
// iterator
export interface Option <T> {
	[Symbol.iterator] (): T extends Iterable<infer I> ? Iterator<I> : never;
}
Option.prototype[Symbol.iterator] = function* (this: Option<Iterable<any>>) {
	if (this.value === null) return;
	if (this.value?.[Symbol.iterator]) 
		for (const item of this.value) yield item;
}
//result extensions
export interface Option <T> {
	okOr <E> (error: E): Result<T, E>;
	okElse <E> (error: () => E): Result<T, E>;
}

export function Some <T> (value: T) { return new Option(value) }
export function None <T> () { return new Option<T>(null) }

Object.defineProperty(None, Symbol.hasInstance, {
	value: (instance: Option<any>) => instance?.value === null
});
Object.defineProperty(Some, Symbol.hasInstance, {
	value: (instance: Option<any>) => instance?.value !== null
});

export function from <T, args extends any[]> (
	fn: (...args: args) => T | undefined | null, ...args: args
) {
	const result = fn(...args);
	return new Option<T>(result === undefined ? null : result);
}

export async function fromAsync <T, args extends any[]> (
	fn: (...args: args) => Promise<T | undefined | null>, ...args: args
) {
	const result = await fn(...args);
	return new Option<T>(result === undefined ? null : result);
}