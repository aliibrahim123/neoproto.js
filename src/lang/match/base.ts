import { GuardType, Primitive } from "../../common/types.ts";

export interface CheckResult {
	matched: boolean,
	extracts: {}
}

export type PatternFn = (value: any, extracts: {}) => value is any;

//convert pattern to type passet to handler
export type PatternToType <P> = 
	P extends PatternFn ? GuardType<P> :
	P extends abstract new (...args: any) => infer T ? T :
	P extends object ? { [K in keyof P]: PatternToType<P[K]> } :
	P;

export function check (value: any, pattern: any, extracts: {}): CheckResult {
	var matched = false;

	//strict equality
	if (Object.is(value, pattern)) matched = true;

	//same type, also side effect: normal function not arrow one
	else if ((pattern as any)?.prototype) matched = value?.constructor === pattern;

	//pattern function, only arrow
	else if (typeof(pattern) === 'function') matched = (pattern as PatternFn)(value, extracts);

	//object
	else if (pattern instanceof Object && value instanceof Object) {
		for (const prop in pattern) {
			matched = check(value[prop], pattern[prop], extracts).matched;
			if (!matched) break; //skip if single mismatch
		}
	}
	return { matched, extracts }
}