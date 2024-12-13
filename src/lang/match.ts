import { check } from './match/base.ts';
import type { CheckResult, PatternToType, PatternFn } from './match/base.ts';
import { $is, eq, $let, allOf, any, anyOf, not, ofAnd, ofType, stricly } from './match/coreHelpers.ts';
import { array, date, map, matchReg, restTuple, restTupleLike, set, tuple, tupleLike, arrayLike } from './match/nativeTypes.ts';

export type MatchResult <O> = {
	matched: boolean,
	value: O | undefined
}
type Case <I, O> = (value: I) => MatchResult<O>;

const isDefaultCase = Symbol('is_default_case');
type DefaultCase <I, O> = Case<I, O> & { [isDefaultCase]: true };

export function match <I, O> (value: I, ...cases: [...Case<I, O>[], DefaultCase<I, O>]): O;
export function match <I, O> (value: I, ...cases: Case<I, O>[]): O | undefined;
export function match<I, O> (value: I, ...cases: Case<I, O>[]): O | undefined {
	return handle(value, cases)
}

export function handle <I, O> (value: I, cases: Case<I, O>[]): O | undefined {
	for (const _case of cases) {
		const result = _case(value);
		if (result.matched) return result.value;
	}
}

export function when <I, O, P> (
	pattern: P, handler: (value: PatternToType<NoInfer<P>>, extracts) => O
): Case<I, O> {
	return (value: I) => {
		const result = check(value, pattern, {});
		if (result.matched)
			 return { matched: true , value: handler(value as any, result.extracts) }
		else return { matched: false, value: undefined }
	}
}

export function otherwise <I, O> (Default: O | ((value: I) => O)): DefaultCase<I, O> {
	const _case: DefaultCase<I, O> = (value: I) => { return { 
		matched: true,
		value: typeof (Default) === 'function' ? (Default as (value: I) => O)(value) : Default
	} }
	_case[isDefaultCase] = true;
	return _case;
}

export { check };
export { $is, eq, $let, allOf, any, anyOf, not, ofAnd, ofType, stricly }
export { array, date, map, matchReg, restTuple, restTupleLike, set, tuple, tupleLike, arrayLike }
export type { CheckResult, PatternToType, PatternFn }