import { check } from "./base.ts";
import type { PatternToType } from "./base.ts";
import { any } from "./coreHelpers.ts";

export function date (pattern = any): (value, extracts) => value is Date {
	return (value, extracts): value is Date => 
		value?.constructor === Date && check(value.valueOf(), pattern, extracts).matched
}

export function matchReg (exp: RegExp): (value: any) => value is string {
	return (value): value is string => typeof(value) === 'string' && exp.test(value)
}

export function set <P> (pattern: P): (value: any, extracts: {}) => value is Set<PatternToType<P>> {
	return ((value, extracts) => {
		if (value?.constructor !== Set) return false;
		for (const item of value) 
			if (!check(item, pattern, extracts).matched) return false;
		return true;
	}) as any
}

export function map <PK, PV> (keyPattern: PK, valuePattern: PV): 
	(value: any, extracts: {}) => value is Map<PatternToType<NoInfer<PK>>, PatternToType<NoInfer<PV>>>
{
	return ((value, extracts) => {
		if (value.constructor !== Map) return false;
		for (const [key, val] of value) {
			if (!check(key, keyPattern, extracts).matched) return false;
			if (!check(val, valuePattern, extracts).matched) return false;
		}
		return true;
	}) as any
}

export function array <P> (pattern: P):
	(value: any, extracts: {}) => value is Array<PatternToType<NoInfer<P>>> 
{
	return ((value, extracts) => Array.isArray(value) 
		&& value.every((item) => check(item, pattern, extracts).matched)) as any
}

export function tuple <P1> (
	pattern1: P1
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>
];
export function tuple <P1, P2> (
	pattern1: P1, pattern2: P2
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>
];
export function tuple <P1, P2, P3> (
	pattern1: P1, pattern2: P2, pattern3: P3
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>
];
export function tuple <P1, P2, P3, P4> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>
];
export function tuple <P1, P2, P3, P4, P5> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>
];
export function tuple <P1, P2, P3, P4, P5, P6> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>
];
export function tuple <P1, P2, P3, P4, P5, P6, P7> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, pattern7: P7
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>, 
	PatternToType<NoInfer<P7>>
];
export function tuple (...patterns): (value: any, extracts: {}) => value is any[] {
	return (value, extracts): value is any[] => Array.isArray(value) && value.length === patterns.length
		&& value.every((item, ind) => check(item, patterns[ind], extracts).matched)
}

export function restTuple <P1, PR> (
	pattern1: P1, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTuple <P1, P2, PR> (
	pattern1: P1, pattern2: P2, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTuple <P1, P2, P3, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>,
	...PatternToType<NoInfer<PR>>[]
];
export function restTuple <P1, P2, P3, P4, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTuple <P1, P2, P3, P4, P5, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTuple <P1, P2, P3, P4, P5, P6, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>,
	...PatternToType<NoInfer<PR>>[]
];
export function restTuple (...patterns): (value: any, extracts: {}) => value is any[] {
	const itemPatterns = patterns.slice(0, -1);
	const restPattern = patterns.at(-1);
	return (value: any, extracts: {}): value is any[] => {
		if (!Array.isArray(value)) return false;
		//normal items
		if (!itemPatterns.every((pattern, ind) => check(value[ind], pattern, extracts).matched)) return false;
		//if not rest item, return true
		if (value.length === itemPatterns.length) return true;
		//rest item, short circuit
		for (let i = itemPatterns.length; i < value.length; i++)
			if (!check(value[i], restPattern, extracts).matched) return false;
		return true
	}
}

export function arrayLike <P> (pattern: P):
	(value: any, extracts: {}) => value is {[index: number]: PatternToType<NoInfer<P>>, length: number} 
{
	return ((value, extracts) => {
		if (value?.length === undefined) return false;
		for (let i = 0; i < value.length; i++) 
			if (!check(value[i], pattern, extracts).matched) return false;
		return true
	}) as any
}

export function tupleLike <P1> (
	pattern1: P1
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>
];
export function tupleLike <P1, P2> (
	pattern1: P1, pattern2: P2
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>
];
export function tupleLike <P1, P2, P3> (
	pattern1: P1, pattern2: P2, pattern3: P3
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>
];
export function tupleLike <P1, P2, P3, P4> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>
];
export function tupleLike <P1, P2, P3, P4, P5> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>
];
export function tupleLike <P1, P2, P3, P4, P5, P6> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>
];
export function tupleLike <P1, P2, P3, P4, P5, P6, P7> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, pattern7: P7
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>, 
	PatternToType<NoInfer<P7>>
];
export function tupleLike (...patterns): (value: any, extracts: {}) => value is any[] {
	return (value, extracts): value is any[] => value?.length === patterns.length
		&& patterns.every((pattern, ind) => check(value[ind], pattern, extracts).matched)
}

export function restTupleLike <P1, PR> (
	pattern1: P1, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike <P1, P2, PR> (
	pattern1: P1, pattern2: P2, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike <P1, P2, P3, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>,
	...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike <P1, P2, P3, P4, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike <P1, P2, P3, P4, P5, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, ...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike <P1, P2, P3, P4, P5, P6, PR> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, restPattern: PR
): (value: any, extracts: {}) => value is [
	PatternToType<NoInfer<P1>>, PatternToType<NoInfer<P2>>, PatternToType<NoInfer<P3>>, 
	PatternToType<NoInfer<P4>>, PatternToType<NoInfer<P5>>, PatternToType<NoInfer<P6>>,
	...PatternToType<NoInfer<PR>>[]
];
export function restTupleLike (...patterns): (value: any, extracts: {}) => value is any[] {
	const itemPatterns = patterns.slice(0, -1);
	const restPattern = patterns.at(-1);
	return (value: any, extracts: {}): value is any[] => {
		if (value?.length === undefined) return false;
		//normal items
		if (!itemPatterns.every((pattern, ind) => check(value[ind], pattern, extracts).matched)) return false;
		//if not rest item, return true
		if (value.length === itemPatterns.length) return true;
		//rest item, short circuit
		for (let i = itemPatterns.length; i < value.length; i++)
			if (!check(value[i], restPattern, extracts).matched) return false;
		return true
	}
}