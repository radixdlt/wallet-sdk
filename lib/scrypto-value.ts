export enum TypeId {
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
  Enum = 'Enum',
  Array = 'Array',
  Tuple = 'Tuple',

  PackageAddress = 'PackageAddress',
  ComponentAddress = 'ComponentAddress',
  ResourceAddress = 'ResourceAddress',
  SystemAddress = 'SystemAddress',

  Bucket = 'Bucket',
  Proof = 'Proof',

  Expression = 'Expression',
  Blob = 'Blob',
  NonFungibleAddress = 'NonFungibleAddress',

  Hash = 'Hash',
  EcdsaSecp256k1PublicKey = 'EcdsaSecp256k1PublicKey',
  EcdsaSecp256k1Signature = 'EcdsaSecp256k1Signature',
  EddsaEd25519PublicKey = 'EddsaEd25519PublicKey',
  EddsaEd25519Signature = 'EddsaEd25519Signature',
  Decimal = 'Decimal',
  PreciseDecimal = 'PreciseDecimal',
  NonFungibleId = 'NonFungibleId',
}

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

export const Tuple = <T extends string[]>(...args: T): `Tuple(${string})` => {
  return `Tuple(${args.join(',')})`
}

export const Array = <T extends TypeId>(
  type: T,
  ...args: string[]
): `Vec<${T}>(${string})` => {
  validateArrayElements(type, args)
  return `Vec<${type}>(${args.join(',')})`
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

export const SystemAddress = (
  systemAddress: `system_${string}`
): `SystemAddress("${string}")` => {
  return `SystemAddress("${systemAddress}")`
}

export const Bucket = (
  bucketId: string | `${string}u32`
): `Bucket(${string})` => {
  return `Bucket(${bucketId})`
}

export const Proof = (proofId: string | `${string}u32`): `Proof(${string})` => {
  return `Proof(${proofId})`
}

export const Expression = <T extends string | 'ENTIRE_WORKTOP'>(
  expression: T
): `Expression("${T}")` => {
  return `Expression("${expression}")`
}

export const Blob = <T extends string>(blob: T): `Blob("${T}")` => {
  return `Blob("${blob}")`
}

export const NonFungibleAddress = (
  nonFungibleAddress: string
): `NonFungibleAddress("${string}")` => {
  return `NonFungibleAddress("${nonFungibleAddress}")`
}

export const Hash = (hash: string): `Hash("${string}")` => {
  return `Hash("${hash}")`
}

export const EcdsaSecp256k1PublicKey = (
  pk: string
): `EcdsaSecp256k1PublicKey("${string}")` => {
  return `EcdsaSecp256k1PublicKey("${pk}")`
}

export const EcdsaSecp256k1Signature = (
  sig: string
): `EcdsaSecp256k1Signature("${string}")` => {
  return `EcdsaSecp256k1Signature("${sig}")`
}

export const EddsaEd25519PublicKey = (
  pk: string
): `EddsaEd25519PublicKey("${string}")` => {
  return `EddsaEd25519PublicKey("${pk}")`
}

export const EddsaEd25519Signature = (
  sig: string
): `EddsaEd25519Signature("${string}")` => {
  return `EddsaEd25519Signature("${sig}")`
}

export const Decimal = (num: number): `Decimal("${string}")` => {
  return `Decimal("${num}")`
}

export const PreciseDecimal = (num: number): `PreciseDecimal("${string}")` => {
  return `PreciseDecimal("${num}")`
}

export const NonFungibleId = (id: string): `NonFungibleId("${string}")` => {
  return `NonFungibleId("${id}")`
}

const validateArrayElements = (type: TypeId, args: string[]) => {
  if (type === TypeId.String) {
    if (args.some((a) => !a.startsWith('"') && !a.endsWith('"'))) {
      throw new ScryptoValueError(`Array<${type}> expects the same type`)
    }
  } else if (type === TypeId.Unit) {
    if (args.some((a) => a !== '()')) {
      throw new ScryptoValueError(`Array<${type}> expects the same type`)
    }
  } else {
    if (args.some((a) => !a.includes(type))) {
      throw new ScryptoValueError(`Array<${type}> expects the same type`)
    }
  }
}