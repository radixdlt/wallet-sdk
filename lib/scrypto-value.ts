export enum BasicType {
  I8 = 'i8',
  I16 = 'i16',
  I32 = 'i32',
  I64 = 'i64',
  I128 = 'i128',
  U8 = 'u8',
  U16 = 'u16',
  U32 = 'u32',
  U64 = 'u64',
  U128 = 'u128',
  Unit = 'Unit',
  Bool = 'Bool',
  String = 'String',
  Struct = 'Struct',
  Enum = 'Enum',
  Option = 'Option',
  Box = 'Box',
  Tuple = 'Tuple',
  Result = 'Result',
  Map = 'Map',
  Decimal = 'Decimal',
  PreciseDecimal = 'PreciseDecimal',
  PackageAddress = 'PackageAddress',
  ComponentAddress = 'ComponentAddress',
  ResourceAddress = 'ResourceAddress',
  NonFungibleAddress = 'NonFungibleAddress',
  Hash = 'Hash',
  Bucket = 'Bucket',
  Proof = 'Proof',
  NonFungibleId = 'NonFungibleId',
}

type Vec<T extends string> = `Vec<${T}>`
type List<T extends string> = `List<${T}>`
type Set<T extends string> = `Set<${T}>`
type TreeSet<T extends string> = `TreeSet<${T}>`

export type Collection =
  | Vec<BasicType>
  | List<BasicType>
  | Set<BasicType>
  | TreeSet<BasicType>

export type Type = BasicType | Collection
export type ResourceAddressType = `resource_${string}`
export type AccountAddressType = `account_${string}`
export type ComponentAddressType = `component_${string}`
export type PackageAddressType = `package_${string}`

export const CollectionType = {
  Vec: <T extends Type>(type: T): Vec<T> => `Vec<${type}>`,
  List: <T extends Type>(type: T): List<T> => `List<${type}>`,
  Set: <T extends Type>(type: T): Set<T> => `Set<${type}>`,
  TreeSet: <T extends Type>(type: T): TreeSet<T> => `TreeSet<${type}>`,
} as const

export type TypeValue =
  | Type
  | `Vec<${Collection}>`
  | `List<${Type | Collection}>`
  | `Set<${Type | Collection}>`

export class ScryptoValueError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage)
  }
}

export const Unit = (): '()' => {
  return '()'
}

export const Bool = (bool: boolean): `${boolean}` => {
  return `${bool}`
}

export const I8 = <T extends number>(num: T): `${T}i8` => {
  if (num < -128 || num > 127) {
    throw new ScryptoValueError('Number range exceeded i8')
  }
  return `${num}i8`
}

export const I16 = <T extends number>(num: T): `${T}i16` => {
  if (num < -32768 || num > 32767) {
    throw new ScryptoValueError('Number range exceeded i16')
  }
  return `${num}i16`
}

export const I32 = <T extends number>(num: T): `${T}i32` => {
  if (num < -2147483648 || num > 2147483647) {
    throw new ScryptoValueError('Number range exceeded i32')
  }
  return `${num}i32`
}

export const I64 = <T extends string>(num: T): `${T}i64` => {
  const bigNum = BigInt(num)
  if (
    bigNum < BigInt('-9223372036854775808') ||
    bigNum > BigInt('9223372036854775807')
  ) {
    throw new ScryptoValueError('Number range exceeded i64')
  }
  return `${num}i64`
}

export const I128 = <T extends string>(num: T): `${T}i128` => {
  const bigNum = BigInt(num)
  if (
    bigNum < BigInt('-170141183460469231731687303715884105728') ||
    bigNum > BigInt('170141183460469231731687303715884105727')
  ) {
    throw new ScryptoValueError('Number range exceeded i128')
  }
  return `${num}i128`
}

export const U8 = <T extends number>(num: T): `${T}u8` => {
  if (num < 0 || num > 255) {
    throw new ScryptoValueError('Number range exceeded u8')
  }
  return `${num}u8`
}

export const U16 = <T extends number>(num: T): `${T}u16` => {
  if (num < 0 || num > 65535) {
    throw new ScryptoValueError('Number range exceeded u16')
  }
  return `${num}u16`
}

export const U32 = <T extends number>(num: T): `${T}u32` => {
  if (num < 0 || num > 4294967295) {
    throw new ScryptoValueError('Number range exceeded u32')
  }
  return `${num}u32`
}

export const U64 = <T extends string>(num: T): `${T}u64` => {
  const bigNum = BigInt(num)
  if (bigNum < 0 || bigNum > BigInt('18446744073709551615')) {
    throw new ScryptoValueError('Number range exceeded u64')
  }
  return `${num}u64`
}

export const U128 = <T extends string>(num: T): `${T}u128` => {
  const bigNum = BigInt(num)
  if (
    bigNum < 0 ||
    bigNum > BigInt('340282366920938463463374607431768211455')
  ) {
    throw new ScryptoValueError('Number range exceeded u128')
  }
  return `${num}u128`
}

export const String = <T extends string>(str: T): `"${T}"` => {
  return `"${str}"`
}

export const Enum = (field: string, ...args: string[]): string => {
  return args.length > 0
    ? `Enum("${field}",${args.join(',')})`
    : `Enum("${field}")`
}

export const Option = {
  Some: <T extends string>(value: T): `Some(${T})` => {
    return `Some(${value})`
  },
  None: 'None',
}

export const Box = <T extends string>(value: T): `Box(${T})` => {
  return `Box(${value})`
}

export const Tuple = <T extends string[]>(...args: T): `Tuple(${string})` => {
  return `Tuple(${args.join(',')})`
}

export const Result = {
  Ok: <T extends string>(value: T): `Ok(${T})` => {
    return `Ok(${value})`
  },
  Err: <T extends string>(value: T): `Err(${T})` => {
    return `Err(${value})`
  },
}

const validateType = (
  type: TypeValue,
  args: string[],
  typeReported: TypeValue
) => {
  if (type === BasicType.String) {
    if (args.some((a) => !a.startsWith('"') && !a.endsWith('"'))) {
      throw new ScryptoValueError(`${typeReported} expects the same type`)
    }
  } else if (type === BasicType.Result) {
    if (args.some((a) => !a.match(/^Ok|^Err/))) {
      throw new ScryptoValueError(`${typeReported} expects the same type`)
    }
  } else if (type === BasicType.Option) {
    if (args.some((a) => !a.match(/^Some|^None/))) {
      throw new ScryptoValueError(`${typeReported} expects the same type`)
    }
  } else if (type === BasicType.Unit) {
    if (args.some((a) => a !== '()')) {
      throw new ScryptoValueError(`${typeReported} expects the same type`)
    }
  } else {
    if (args.some((a) => !a.includes(type))) {
      throw new ScryptoValueError(`${typeReported} expects the same type`)
    }
  }
}

export const Vec = <T extends Type>(
  type: T,
  ...args: string[]
): `Vec<${T}>(${string})` => {
  validateType(type, args, CollectionType.Vec(type))
  return `Vec<${type}>(${args.join(',')})`
}

export const List = <T extends Type>(
  type: T,
  ...args: string[]
): `List<${T}>(${string})` => {
  validateType(type, args, CollectionType.List(type))
  return `List<${type}>(${args.join(',')})`
}

export const Set = <T extends Type>(
  type: T,
  ...args: string[]
): `Set<${T}>(${string})` => {
  validateType(type, args, CollectionType.Set(type))
  return `Set<${type}>(${args.join(',')})`
}

export const TreeSet = <T extends Type>(
  type: T,
  set: string[]
): `TreeSet<${T}>(${string})` => {
  return `TreeSet<${type}>(${set.join(',')})`
}

export const Map = (
  keyType: TypeValue,
  valueType: TypeValue,
  ...args: string[]
): string => {
  validateType(
    keyType,
    args.filter((_, i) => i % 2 === 0),
    BasicType.Map
  )
  validateType(
    valueType,
    args.filter((_, i) => i % 2 !== 0),
    BasicType.Map
  )
  return `Map<${keyType},${valueType}>(${args.join(',')})`
}

export const Decimal = (num: number): `Decimal("${string}")` => {
  return `Decimal("${num}")`
}

export const PreciseDecimal = (num: number): `PreciseDecimal("${string}")` => {
  return `PreciseDecimal("${num}")`
}

export const PackageAddress = (
  packageAddress: `package_${string}`
): `PackageAddress("${string}")` => {
  return `PackageAddress("${packageAddress}")`
}

export const ComponentAddress = (
  componentAddress: `component_${string}` | `account_${string}`
): `ComponentAddress("${string}")` => {
  return `ComponentAddress("${componentAddress}")`
}

export const ResourceAddress = (
  resourceAddress: `resource_${string}`
): `ResourceAddress("${string}")` => {
  return `ResourceAddress("${resourceAddress}")`
}

export const NonFungibleAddress = (
  nonFungibleAddress: string
): `NonFungibleAddress("${string}")` => {
  return `NonFungibleAddress("${nonFungibleAddress}")`
}

export const Hash = (hash: string): `Hash("${string}")` => {
  return `Hash("${hash}")`
}

export const Bucket = (
  bucketId: string | `${string}u32`
): `Bucket(${string})` => {
  return `Bucket(${bucketId})`
}

export const Proof = (proofId: string | `${string}u32`): `Proof(${string})` => {
  return `Proof(${proofId})`
}

export const NonFungibleId = (
  nonFungibleId: string
): `NonFungibleId("${string}")` => {
  return `NonFungibleId("${nonFungibleId}")`
}

export const Expression = <T extends string | 'ENTIRE_WORKTOP'>(
  expression: T
): `Expression("${T}")` => {
  return `Expression("${expression}")`
}

export const Blob = <T extends string>(blob: T): `Blob("${T}")` => {
  return `Blob("${blob}")`
}
