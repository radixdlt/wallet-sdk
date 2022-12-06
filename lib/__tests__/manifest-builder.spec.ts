/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */

import {
  Bool,
  Box,
  Bucket,
  CollectionType,
  ComponentAddress,
  Decimal,
  Enum,
  Hash,
  I128,
  I16,
  I32,
  I64,
  I8,
  List,
  Map,
  NonFungibleAddress,
  Option,
  PackageAddress,
  PreciseDecimal,
  ResourceAddress,
  Result,
  Set,
  String,
  ScryptoValueError,
  Tuple,
  BasicType,
  U128,
  U16,
  U32,
  U64,
  U8,
  Unit,
  Vec,
  Expression,
} from '../scrypto-value'

describe('scrypto value', () => {
  it.each([
    [Unit(), '()'],
    [Bool(false), 'false'],
    [Bool(true), 'true'],
    [I8(8), '8i8'],
    [I16(16), '16i16'],
    [I32(32), '32i32'],
    [I64('64'), '64i64'],
    [I128('128'), '128i128'],
    [U8(8), '8u8'],
    [U16(16), '16u16'],
    [U32(32), '32u32'],
    [U64('64'), '64u64'],
    [U128('128'), '128u128'],
    [Decimal(42.42), 'Decimal("42.42")'],
    [PreciseDecimal(42.42), 'PreciseDecimal("42.42")'],
    [Expression('ENTIRE_WORKTOP'), 'Expression("ENTIRE_WORKTOP")'],
    [Enum('Foo'), 'Enum("Foo")'],
    [
      Enum('Foo', String('some string'), Bool(false)),
      'Enum("Foo","some string",false)',
    ],
    [Option.Some(String('foobar')), 'Some("foobar")'],
    [Option.Some(U128('128')), 'Some(128u128)'],
    [Option.Some(Decimal(219.01234)), 'Some(Decimal("219.01234"))'],
    [Option.None, 'None'],
    [Box(U64('64')), 'Box(64u64)'],
    [Box(Decimal(42.42)), 'Box(Decimal("42.42"))'],
    [Tuple(Decimal(42.42), String('foo')), 'Tuple(Decimal("42.42"),"foo")'],
    [Tuple(Decimal(42.42), String('foo')), 'Tuple(Decimal("42.42"),"foo")'],
    [Result.Ok(Decimal(42.42)), 'Ok(Decimal("42.42"))'],
    [
      Result.Ok(Tuple(Decimal(42.42), I128('256'))),
      'Ok(Tuple(Decimal("42.42"),256i128))',
    ],
    [
      Vec(BasicType.String, String('foo'), String('bar')),
      'Vec<String>("foo","bar")',
    ],
    [
      Vec(BasicType.Decimal, Decimal(42.42), Decimal(42.42)),
      'Vec<Decimal>(Decimal("42.42"),Decimal("42.42"))',
    ],
    [
      List(BasicType.String, String('foo'), String('bar')),
      'List<String>("foo","bar")',
    ],
    [
      List(BasicType.Decimal, Decimal(42.42), Decimal(42.42)),
      'List<Decimal>(Decimal("42.42"),Decimal("42.42"))',
    ],
    [
      Set(BasicType.String, String('foo'), String('bar')),
      'Set<String>("foo","bar")',
    ],
    [
      Set(BasicType.Decimal, Decimal(42.42), Decimal(42.42)),
      'Set<Decimal>(Decimal("42.42"),Decimal("42.42"))',
    ],
    [
      Map(BasicType.String, BasicType.String, String('foo'), String('bar')),
      'Map<String,String>("foo","bar")',
    ],
    [
      Map(BasicType.String, BasicType.Decimal, String('foo'), Decimal(42.42)),
      'Map<String,Decimal>("foo",Decimal("42.42"))',
    ],
    [PackageAddress('package_foo'), 'PackageAddress("package_foo")'],
    [ComponentAddress('component_foo'), 'ComponentAddress("component_foo")'],
    [ResourceAddress('resource_foo'), 'ResourceAddress("resource_foo")'],
    [NonFungibleAddress('foobar'), 'NonFungibleAddress("foobar")'],
    [Hash('hashfoo'), 'Hash("hashfoo")'],
    [Bucket(String('foo')), 'Bucket("foo")'],
    [Bucket(U32(35)), 'Bucket(35u32)'],
  ])('should correctly return %s as %s', (test, expected) => {
    expect(test).toBe(expected)
  })

  it.each([
    [
      Box(
        Map(
          BasicType.String,
          CollectionType.Vec(BasicType.U8),
          String('foo'),
          Vec(BasicType.U8, U8(1), U8(2), U8(3))
        )
      ),
      'Box(Map<String,Vec<u8>>("foo",Vec<u8>(1u8,2u8,3u8)))',
    ],
    [
      Vec(
        CollectionType.Set(BasicType.U8),
        Set(BasicType.U8, U8(1), U8(2), U8(3))
      ),
      'Vec<Set<u8>>(Set<u8>(1u8,2u8,3u8))',
    ],
  ])('should correctly return complex data type %s as %s', (test, expected) => {
    expect(test).toBe(expected)
  })

  it.each([
    [() => I8(128), 'Number range exceeded i8'],
    [() => I8(-129), 'Number range exceeded i8'],
    [() => I16(-32769), 'Number range exceeded i16'],
    [() => I16(32769), 'Number range exceeded i16'],
    [() => I32(-2147483649), 'Number range exceeded i32'],
    [() => I32(2147483648), 'Number range exceeded i32'],
    [() => I64('-9223372036854775809'), 'Number range exceeded i64'],
    [() => I64('9223372036854775808'), 'Number range exceeded i64'],
    [
      () => I128('-170141183460469231731687303715884105729'),
      'Number range exceeded i128',
    ],
    [
      () => I128('170141183460469231731687303715884105728'),
      'Number range exceeded i128',
    ],
    [() => U8(256), 'Number range exceeded u8'],
    [() => U8(-1), 'Number range exceeded u8'],
    [() => U16(-1), 'Number range exceeded u16'],
    [() => U16(65536), 'Number range exceeded u16'],
    [() => U32(-1), 'Number range exceeded u32'],
    [() => U32(4294967296), 'Number range exceeded u32'],
    [() => U64('-1'), 'Number range exceeded u64'],
    [() => U64('18446744073709551616'), 'Number range exceeded u64'],
    [() => U128('-1'), 'Number range exceeded u128'],
    [
      () => U128('340282366920938463463374607431768211456'),
      'Number range exceeded u128',
    ],
    [
      () => Vec(BasicType.String, String('foo'), U32(32)),
      'Vec<String> expects the same type',
    ],
    [() => Vec(BasicType.U8, U8(25), U32(25)), 'Vec<u8> expects the same type'],
    [
      () => List(BasicType.String, String('foo'), U32(32)),
      'List<String> expects the same type',
    ],
    [
      () => List(BasicType.U8, U8(25), U32(25)),
      'List<u8> expects the same type',
    ],
    [
      () => Set(BasicType.String, String('foo'), U32(32)),
      'Set<String> expects the same type',
    ],
    [() => Set(BasicType.U8, U8(25), U32(25)), 'Set<u8> expects the same type'],
  ])('should fail with TransactionSpecError', (test, expected) => {
    expect(test).toThrowError(new ScryptoValueError(expected))
  })
})