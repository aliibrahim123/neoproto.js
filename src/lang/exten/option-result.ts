import { Option } from '../option.ts';
import { Result } from '../result.ts';

//option extensions
Object.assign(Option.prototype, {
	okOr <E> (this: Option<any>, error: E) {
		if (this.value !== null) return new Result(this.value, undefined);
		return new Result(undefined, error);
	},
	okElse <E> (this: Option<any>, error: () => E) {
		if (this.value !== null) return new Result(this.value, undefined);
		return new Result(undefined, error());
	},
} as Option<any>)

//result extensions
Object.assign(Result.prototype, {
	ok (this: Result<any, any>) { return new Option(this.isOk ? this._ok : null) },
	err (this: Result<any, any>) { return new Option(this.isErr ? this._err : null) }
} as Result<any, any>)

export * from '../option.ts';
export * from '../result.ts';