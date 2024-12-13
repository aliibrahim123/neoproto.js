export type Predicate <T> = (value: T) => boolean;

export type GuardType <T> = T extends (v: any, ...args) => v is infer U ? U : never;

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

export type Constructor = abstract new (...args: any[]) => any;