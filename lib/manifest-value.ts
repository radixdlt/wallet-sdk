// TODO: define the exact list of HRP prefixes post RCNet
export type AddressString = `${string}`

export enum TypeId {
  Bool = 'Bool',
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
  String = 'String',
  Enum = 'Enum',
  Array = 'Array',
  Tuple = 'Tuple',
  Map = 'Map',

  Address = 'Address',
  Bucket = 'Bucket',
  Proof = 'Proof',
  Expression = 'Expression',
  Blob = 'Blob',
  Decimal = 'Decimal',
  PreciseDecimal = 'PreciseDecimal',
  NonFungibleLocalId = 'NonFungibleLocalId',

  // Not in value model, but supported by manifest compiler
  NonFungibleGlobalId = 'NonFungibleGlobalId',
  Bytes = 'Bytes',
}

export class ManifestValueError extends Error {
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
    throw new ManifestValueError('Number range exceeded i8')
  }
  return `${num}i8`
}

export const I16 = <T extends number>(num: T): `${T}i16` => {
  if (num < -32768 || num > 32767) {
    throw new ManifestValueError('Number range exceeded i16')
  }
  return `${num}i16`
}

export const I32 = <T extends number>(num: T): `${T}i32` => {
  if (num < -2147483648 || num > 2147483647) {
    throw new ManifestValueError('Number range exceeded i32')
  }
  return `${num}i32`
}

export const I64 = <T extends string>(num: T): `${T}i64` => {
  const bigNum = BigInt(num)
  if (
    bigNum < BigInt('-9223372036854775808') ||
    bigNum > BigInt('9223372036854775807')
  ) {
    throw new ManifestValueError('Number range exceeded i64')
  }
  return `${num}i64`
}

export const I128 = <T extends string>(num: T): `${T}i128` => {
  const bigNum = BigInt(num)
  if (
    bigNum < BigInt('-170141183460469231731687303715884105728') ||
    bigNum > BigInt('170141183460469231731687303715884105727')
  ) {
    throw new ManifestValueError('Number range exceeded i128')
  }
  return `${num}i128`
}

export const U8 = <T extends number>(num: T): `${T}u8` => {
  if (num < 0 || num > 255) {
    throw new ManifestValueError('Number range exceeded u8')
  }
  return `${num}u8`
}

export const U16 = <T extends number>(num: T): `${T}u16` => {
  if (num < 0 || num > 65535) {
    throw new ManifestValueError('Number range exceeded u16')
  }
  return `${num}u16`
}

export const U32 = <T extends number>(num: T): `${T}u32` => {
  if (num < 0 || num > 4294967295) {
    throw new ManifestValueError('Number range exceeded u32')
  }
  return `${num}u32`
}

export const U64 = <T extends string>(num: T): `${T}u64` => {
  const bigNum = BigInt(num)
  if (bigNum < 0 || bigNum > BigInt('18446744073709551615')) {
    throw new ManifestValueError('Number range exceeded u64')
  }
  return `${num}u64`
}

export const U128 = <T extends string>(num: T): `${T}u128` => {
  const bigNum = BigInt(num)
  if (
    bigNum < 0 ||
    bigNum > BigInt('340282366920938463463374607431768211455')
  ) {
    throw new ManifestValueError('Number range exceeded u128')
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

export const Tuple = <T extends string[]>(...args: T): `Tuple(${string})` => {
  return `Tuple(${args.join(',')})`
}

export const Array = <T extends TypeId>(
  type: T,
  ...args: string[]
): `Array<${T}>(${string})` => {
  validateArrayElements(type, args)
  return `Array<${type}>(${args.join(',')})`
}

export const Map = <T extends TypeId, E extends TypeId>(
  keyType: T,
  valueType: E,
  ...args: string[]
): `Map<${T},${E}>(${string})` => {
  return `Map<${keyType},${valueType}>(${args.join(',')})`
}

export const Address = (address: AddressString): `Address("${string}")` => {
  return `Address("${address}")`
}

export const Bucket = (bucketId: string | number): `Bucket(${string})` => {
  if (typeof bucketId === 'string') {
    return `Bucket("${bucketId}")`
  } else {
    return `Bucket(${bucketId}u32)`
  }
}

export const Proof = (proofId: string | number): `Proof(${string})` => {
  if (typeof proofId === 'string') {
    return `Proof("${proofId}")`
  } else {
    return `Proof(${proofId}u32)`
  }
}

export const Expression = <T extends string | 'ENTIRE_WORKTOP'>(
  expression: T
): `Expression("${T}")` => {
  return `Expression("${expression}")`
}

export const Blob = <T extends string>(blob: T): `Blob("${T}")` => {
  return `Blob("${blob}")`
}

export type NonFungibleIdType =
  | `"${string}"`
  | `#${number}#`
  | `[${string}]`
  | `{${string}}`

export const NonFungibleType = {
  String: <T extends string>(id: T): `"${T}"` => `"${id}"`,
  Integer: <T extends number | string>(id: T): `#${T}#` => `#${id}#`,
  Byte: <T extends string>(id: T): `[${T}]` => `[${id}]`,
  Uuid: <T extends string>(id: T): `{${T}}` => `{${id}}`,
}

export const Decimal = (num: number): `Decimal("${string}")` => {
  return `Decimal("${num}")`
}

export const PreciseDecimal = (num: number): `PreciseDecimal("${string}")` => {
  return `PreciseDecimal("${num}")`
}

export const NonFungibleLocalId = (
  id: string
): `NonFungibleLocalId("${string}")` => {
  return `NonFungibleLocalId("${id}")`
}

export const NonFungibleGlobalId = <
  R extends AddressString,
  T extends NonFungibleIdType
>(
  resourceAddress: R,
  nonFungibleId: T
): `NonFungibleGlobalId("${R}:${T}")` => {
  return `NonFungibleGlobalId("${resourceAddress}:${nonFungibleId}")`
}

export const Bytes = (hex: String): `Bytes("${string}")` => {
  return `Bytes("${hex}")`
}

const validateArrayElements = (type: TypeId, args: string[]) => {
  if (type === TypeId.String) {
    if (args.some((a) => !a.startsWith('"') && !a.endsWith('"'))) {
      throw new ManifestValueError(`Array<${type}> expects the same type`)
    }
  } else if (type === TypeId.Unit) {
    if (args.some((a) => a !== '()')) {
      throw new ManifestValueError(`Array<${type}> expects the same type`)
    }
  } else {
    if (args.some((a) => !a.includes(type))) {
      throw new ManifestValueError(`Array<${type}> expects the same type`)
    }
  }
}
