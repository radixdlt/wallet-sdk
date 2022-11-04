import flow from 'lodash.flow'

export function requestBuilder<T, R1, R2, R3, R4, R5>(
  f1: (t: T) => R1,
  f2: (t: R1) => R2,
  f3: (t: R2) => R3,
  f4: (t: R3) => R4,
  f5: (t: R4) => R5
): R5
export function requestBuilder<T, R1, R2, R3, R4>(
  f1: (t: T) => R1,
  f2: (t: R1) => R2,
  f3: (t: R2) => R3,
  f4: (t: R3) => R4
): R4
export function requestBuilder<T, R1, R2, R3>(
  f1: (t: T) => R1,
  f2: (t: R1) => R2,
  f3: (t: R2) => R3
): R3
export function requestBuilder<T, R1, R2>(
  f1: (t: T) => R1,
  f2: (t: R1) => R2
): R2
export function requestBuilder<T, R1>(f1: (t: T) => R1): R1
export function requestBuilder<T>(...funcs: ((...args: any[]) => any)[]): T {
  return flow(funcs)({})
}
