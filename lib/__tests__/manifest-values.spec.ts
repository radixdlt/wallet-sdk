/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */

import { ManifestBuilder } from '../manifest-builder'
import {
  Bool,
  Bucket,
  Address,
  Decimal,
  Enum,
  I128,
  I16,
  I32,
  I64,
  I8,
  NonFungibleGlobalId,
  PreciseDecimal,
  String,
  ManifestValueError,
  Tuple,
  TypeId,
  Proof,
  U128,
  U16,
  U32,
  U64,
  U8,
  Unit,
  Array,
  Expression,
  NonFungibleLocalId,
} from '../manifest-value'

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
    [Enum('Some', String('foobar')), 'Enum("Some","foobar")'],
    [Enum('Some', U128('128')), 'Enum("Some",128u128)'],
    [Enum('Some', Decimal(219.01234)), 'Enum("Some",Decimal("219.01234"))'],
    [Enum('None'), 'Enum("None")'],
    [Tuple(Decimal(42.42), String('foo')), 'Tuple(Decimal("42.42"),"foo")'],
    [Tuple(Decimal(42.42), String('foo')), 'Tuple(Decimal("42.42"),"foo")'],
    [
      Array(TypeId.String, String('foo'), String('bar')),
      'Array<String>("foo","bar")',
    ],
    [
      Array(TypeId.Decimal, Decimal(42.42), Decimal(42.42)),
      'Array<Decimal>(Decimal("42.42"),Decimal("42.42"))',
    ],
    [Address('package_foo'), 'Address("package_foo")'],
    [Address('component_foo'), 'Address("component_foo")'],
    [Address('account_foo'), 'Address("account_foo")'],
    [Address('resource_foo'), 'Address("resource_foo")'],
    [
      NonFungibleGlobalId('resource_foo:#123#'),
      'NonFungibleGlobalId("resource_foo:#123#")',
    ],
    [Bucket('foo'), 'Bucket("foo")'],
    [Bucket(35), 'Bucket(35u32)'],
    [Proof('foo'), 'Proof("foo")'],
    [Proof(35), 'Proof(35u32)'],
    [Decimal(1.234), 'Decimal("1.234")'],
    [PreciseDecimal(1.234), 'PreciseDecimal("1.234")'],
    [NonFungibleLocalId.String('id'), 'NonFungibleLocalId("<id>")'],
  ])('should correctly return %s as %s', (test, expected) => {
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
      () => Array(TypeId.String, String('foo'), U32(32)),
      'Array<String> expects the same type',
    ],
    [
      () => Array(TypeId.U8, U8(25), U32(25)),
      'Array<u8> expects the same type',
    ],
  ])('should fail with ManifestValueError', (test, expected) => {
    expect(test).toThrowError(new ManifestValueError(expected))
  })
})

describe('manifest builder', () => {
  it('complex', () => {
    expect(
      new ManifestBuilder()
        .takeFromWorktop(
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'bucket1'
        )
        .takeFromWorktopByAmount(
          5,
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'bucket2'
        )
        .takeFromWorktopByIds(
          ['#123#'],
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'bucket3'
        )
        .returnToWorktop('bucket3')
        .assertWorktopContains(
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k'
        )
        .assertWorktopContainsByAmount(
          5,
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k'
        )
        .assertWorktopContainsByIds(
          ['[deadbeef]'],
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k'
        )
        .popFromAuthZone('proof1')
        .pushToAuthZone('proof1')
        .clearAuthZone()
        .createProofFromAuthZone(
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'proof2'
        )
        .createProofFromAuthZoneByAmount(
          5,
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'proof3'
        )
        .createProofFromAuthZoneByIds(
          ['<hello>'],
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          'proof4'
        )
        .createProofFromBucket('bucket2', 'proof5')
        .cloneProof('proof5', 'proof6')
        .dropProof('proof6')
        .callFunction(
          'package_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq57ks9j',
          'GumballMachine',
          'new',
          []
        )
        .callMethod(
          'component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x',
          'withdraw',
          [
            Address(
              'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k'
            ),
            Decimal(5.0),
          ]
        )
        .mintFungible(
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          5
        )
        .withdrawFromAccount(
          'component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x',
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          5
        )
        .withdrawNonFungiblesFromAccount(
          'component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x',
          'resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k',
          ['#123#']
        )
        .build()
        .toString()
    )
      .toBe(`TAKE_FROM_WORKTOP Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("bucket1");
TAKE_FROM_WORKTOP_BY_AMOUNT Decimal("5") Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("bucket2");
TAKE_FROM_WORKTOP_BY_IDS Array<NonFungibleLocalId>(NonFungibleLocalId("#123#")) Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("bucket3");
RETURN_TO_WORKTOP Bucket("bucket3");
ASSERT_WORKTOP_CONTAINS Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k");
ASSERT_WORKTOP_CONTAINS_BY_AMOUNT Decimal("5") Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k");
ASSERT_WORKTOP_CONTAINS_BY_IDS Array<NonFungibleLocalId>(NonFungibleLocalId("[deadbeef]")) Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k");
POP_FROM_AUTH_ZONE Proof("proof1");
PUSH_TO_AUTH_ZONE Proof("proof1");
CLEAR_AUTH_ZONE;
CREATE_PROOF_FROM_AUTH_ZONE Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Proof("proof2");
CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT Decimal("5") Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Proof("proof3");
CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS Array<NonFungibleLocalId>(NonFungibleLocalId("<hello>")) Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Proof("proof4");
CREATE_PROOF_FROM_BUCKET Bucket("bucket2") Proof("proof5");
CLONE_PROOF Proof("proof5") Proof("proof6");
DROP_PROOF Proof("proof6");
CALL_FUNCTION Address("package_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq57ks9j") "GumballMachine" "new" ;
CALL_METHOD Address("component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x") "withdraw" Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Decimal("5");
MINT_FUNGIBLE Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Decimal("5");
CALL_METHOD Address("component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x") "withdraw" Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Decimal("5");
CALL_METHOD Address("component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x") "withdraw_non_fungibles" Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Array<NonFungibleLocalId>(NonFungibleLocalId("#123#"));`)
  })

  // Compile the above output with `rtmc` to ensure the SDK is up to date
})
