import { check } from "./base.ts";
import type { PatternToType } from "./base.ts";
import type { Constructor } from "../../common/types.ts";

export function $is <P> (pattern: P): 
	((value: any, extracts: {}) => value is PatternToType<NoInfer<P>>)
{
	return ((value, extracts) => check(value, pattern, extracts).matched) as any
}

export function $let <P> (name: keyof any, pattern: P = any as P): 
	(value: any, extracts: {}) => value is PatternToType<NoInfer<P>> 
{
	return ((value, extracts) => {
		extracts[name] = value;
		return check(value, pattern, extracts).matched;
	}) as any
}

export function eq <T> (b: T): ((value: any) => value is T) {
	return (value: any): value is T => value === b;
}

export function ofType <T extends Constructor> (type: T): 
	(value: any) => value is InstanceType<T> 
{
	return (value): value is InstanceType<T> => value instanceof type;
}

export function ofAnd <T extends Constructor, P> (type: T, pattern: P): 
	(value: any, extracts: {}) => value is InstanceType<T>
{
	return (value, extracts): value is InstanceType<T> => 
		value?.constructor === type && check(value, pattern, extracts).matched
}

export const any = (value: any): value is any => true;

export function stricly <P> (pattern: P & object):
	(value: any, extracts: {}) => value is PatternToType<NoInfer<P>> 
{
	return ((value, extracts) => {
		if (!(value instanceof Object)) return false;
		//check all props in pattern
		for (const prop in pattern) 
			if (!check(value[prop], pattern[prop as string], extracts)) return false;
		//check if value has no additional keys
		for (const prop in value) if (!(prop in pattern)) return false;
		return true
	}) as any
};

export function allOf <P1> (pattern1: P1): 
	(value: any, extracts: {}) => value is (PatternToType<NoInfer<P1>>);
export function allOf <P1, P2> (pattern1: P1, pattern2: P2):
	(value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>>
);
export function allOf <P1, P2, P3> (
	pattern1: P1, pattern2: P2, pattern3: P3
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>> & PatternToType<NoInfer<P3>>
);
export function allOf <P1, P2, P3, P4> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>> & PatternToType<NoInfer<P3>> & 
	PatternToType<NoInfer<P4>>
);
export function allOf <P1, P2, P3, P4, P5> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>> & PatternToType<NoInfer<P3>> & 
	PatternToType<NoInfer<P4>> & PatternToType<NoInfer<P5>>
);
export function allOf <P1, P2, P3, P4, P5, P6> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>> & PatternToType<NoInfer<P3>> & 
	PatternToType<NoInfer<P4>> & PatternToType<NoInfer<P5>> & PatternToType<NoInfer<P6>>
);
export function allOf <P1, P2, P3, P4, P5, P6, P7> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, pattern7: P7
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> & PatternToType<NoInfer<P2>> & PatternToType<NoInfer<P3>> & 
	PatternToType<NoInfer<P4>> & PatternToType<NoInfer<P5>> & PatternToType<NoInfer<P6>> & 
	PatternToType<NoInfer<P7>>
);
export function allOf (...patterns): (value: any, extracts: {}) => value is any {
	return (value, extracts): value is any => 
		patterns.every(pattern => check(value, pattern, extracts).matched);
}

export function anyOf <P1> (pattern1: P1):
	(value: any, extracts: {}) => value is (PatternToType<NoInfer<P1>>);
export function anyOf <P1, P2> (pattern1: P1, pattern2: P2):
	(value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>>
);
export function anyOf <P1, P2, P3> (
	pattern1: P1, pattern2: P2, pattern3: P3
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>> | PatternToType<NoInfer<P3>>
);
export function anyOf <P1, P2, P3, P4> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>> | PatternToType<NoInfer<P3>> | 
	PatternToType<NoInfer<P4>>
);
export function anyOf <P1, P2, P3, P4, P5> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>> | PatternToType<NoInfer<P3>> | 
	PatternToType<NoInfer<P4>> | PatternToType<NoInfer<P5>>
);
export function anyOf <P1, P2, P3, P4, P5, P6> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>> | PatternToType<NoInfer<P3>> | 
	PatternToType<NoInfer<P4>> | PatternToType<NoInfer<P5>> | PatternToType<NoInfer<P6>>
);
export function anyOf <P1, P2, P3, P4, P5, P6, P7> (
	pattern1: P1, pattern2: P2, pattern3: P3, pattern4: P4, pattern5: P5, pattern6: P6, pattern7: P7
): (value: any, extracts: {}) => value is (
	PatternToType<NoInfer<P1>> | PatternToType<NoInfer<P2>> | PatternToType<NoInfer<P3>> | 
	PatternToType<NoInfer<P4>> | PatternToType<NoInfer<P5>> | PatternToType<NoInfer<P6>> | 
	PatternToType<NoInfer<P7>>
);
export function anyOf (...patterns): (value: any, extracts: {}) => value is any {
	return (value, extracts): value is any => 
		patterns.some(pattern => check(value, pattern, extracts).matched);
}

export function not (pattern): (value: any, extracts: {}) => value is unknown {
	return ((value, extracts) => !check(value, pattern, extracts).matched) as any
}