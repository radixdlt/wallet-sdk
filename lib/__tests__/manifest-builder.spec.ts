/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */

import { ManifestBuilder } from '../manifest-builder'
import {
  Bool,
  Bucket,
  ComponentAddress,
  Decimal,
  Enum,
  Hash,
  I128,
  I16,
  I32,
  I64,
  I8,
  NonFungibleAddress,
  PackageAddress,
  PreciseDecimal,
  ResourceAddress,
  EcdsaSecp256k1PublicKey,
  EcdsaSecp256k1Signature,
  EddsaEd25519PublicKey,
  EddsaEd25519Signature,
  NonFungibleId,
  String,
  ScryptoValueError,
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
  SystemAddress,
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
    [PackageAddress('package_foo'), 'PackageAddress("package_foo")'],
    [ComponentAddress('component_foo'), 'ComponentAddress("component_foo")'],
    [ComponentAddress('account_foo'), 'ComponentAddress("account_foo")'],
    [ResourceAddress('resource_foo'), 'ResourceAddress("resource_foo")'],
    [SystemAddress('system_foo'), 'SystemAddress("system_foo")'],
    [
      NonFungibleAddress('resource_foo', '123u32'),
      'NonFungibleAddress("resource_foo", 123u32)',
    ],
    [Bucket(String('foo')), 'Bucket("foo")'],
    [Bucket(U32(35)), 'Bucket(35u32)'],
    [Proof(String('foo')), 'Proof("foo")'],
    [Proof(U32(35)), 'Proof(35u32)'],
    [Bucket(String('foo')), 'Bucket("foo")'],
    [Bucket(U32(35)), 'Bucket(35u32)'],
    [Hash('hashfoo'), 'Hash("hashfoo")'],
    [EcdsaSecp256k1PublicKey('a'), 'EcdsaSecp256k1PublicKey("a")'],
    [EcdsaSecp256k1Signature('a'), 'EcdsaSecp256k1Signature("a")'],
    [EddsaEd25519PublicKey('a'), 'EddsaEd25519PublicKey("a")'],
    [EddsaEd25519Signature('a'), 'EddsaEd25519Signature("a")'],
    [Decimal(1.234), 'Decimal("1.234")'],
    [PreciseDecimal(1.234), 'PreciseDecimal("1.234")'],
    [NonFungibleId('id'), 'NonFungibleId(id)'],
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
  ])('should fail with ScryptoValueError', (test, expected) => {
    expect(test).toThrowError(new ScryptoValueError(expected))
  })
})

describe('manifest builder', () => {
  it('complex', () => {
    expect(
      new ManifestBuilder()
        .takeFromWorktop(
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'bucket1'
        )
        .takeFromWorktopByAmount(
          5,
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'bucket2'
        )
        .takeFromWorktopByIds(
          Array(TypeId.NonFungibleId, NonFungibleId('123u32')),
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'bucket3'
        )
        .returnToWorktop('bucket3')
        .assertWorktopContains(
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .assertWorktopContainsByAmount(
          5,
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .assertWorktopContainsByIds(
          Array(TypeId.NonFungibleId, NonFungibleId('Bytes("deadbeef")')),
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .popFromAuthZone('proof1')
        .pushToAuthZone('proof1')
        .clearAuthZone()
        .createProofFromAuthZone(
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'proof2'
        )
        .createProofFromAuthZoneByAmount(
          5,
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'proof3'
        )
        .createProofFromAuthZoneByIds(
          Array(TypeId.NonFungibleId, NonFungibleId('"hello"')),
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          'proof4'
        )
        .createProofFromBucket('bucket2', 'proof5')
        .cloneProof('proof5', 'proof6')
        .dropProof('proof6')
        .callFunction(
          'package_sim1qyqzcexvnyg60z7lnlwauh66nhzg3m8tch2j8wc0e70qkydk8r',
          'GumballMachine',
          'new',
          []
        )
        .callMethod(
          'account_sim1q02r73u7nv47h80e30pc3q6ylsj7mgvparm3pnsm780qgsy064',
          'withdraw_by_amount',
          [
            Decimal(5.0),
            ResourceAddress(
              'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
            ),
          ]
        )
        .callNativeFunction('ResourceManger', 'create', [
          Enum('Fungible', U8(0)),
          Array(TypeId.Tuple),
          Array(TypeId.Tuple),
          Enum('Some', Enum('Fungible', Decimal(1.0))),
        ])
        .callNativeMethod(
          'Global("component_sim1q2f9vmyrmeladvz0ejfttcztqv3genlsgpu9vue83mcs835hum")',
          'claim_royalty',
          []
        )
        .publishPackageWithOwner(
          '985792bf3aa28de2793e33983607f4c39bed3e96626cb05a99fdc75caf2d111e',
          '985792bf3aa28de2793e33983607f4c39bed3e96626cb05a99fdc75caf2d111e',
          NonFungibleAddress(
            'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
            '1u32'
          )
        )
        .createResource(
          Enum('Fungible', U8(0)),
          Array(TypeId.Tuple),
          Array(TypeId.Tuple),
          Enum('Some', Enum('Fungible', Decimal(1.0)))
        )
        .burnBucket('bucket1')
        .mintFungible(
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag',
          5
        )
        .withdrawFromAccount(
          'account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97',
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .withdrawFromAccountByAmount(
          'account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97',
          5,
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .withdrawFromAccountByIds(
          'account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97',
          Array(TypeId.NonFungibleId, NonFungibleId('123u32')),
          'resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag'
        )
        .build()
        .toString()
    )
      .toBe(`TAKE_FROM_WORKTOP ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Bucket(bucket1);
TAKE_FROM_WORKTOP_BY_AMOUNT Decimal("5") ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Bucket(bucket2);
TAKE_FROM_WORKTOP_BY_IDS Array<NonFungibleId>(NonFungibleId(123u32)) ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Bucket(bucket3);
RETURN_TO_WORKTOP Bucket(bucket3);
ASSERT_WORKTOP_CONTAINS ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
ASSERT_WORKTOP_CONTAINS_BY_AMOUNT Decimal("5") ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
ASSERT_WORKTOP_CONTAINS_BY_IDS Array<NonFungibleId>(NonFungibleId(Bytes("deadbeef"))) ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
POP_FROM_AUTH_ZONE Proof(proof1);
PUSH_TO_AUTH_ZONE Proof(proof1);
CLEAR_AUTH_ZONE;
CREATE_PROOF_FROM_AUTH_ZONE ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Proof(proof2);
CREATE_PROOF_FROM_AUTH_ZONE_BY_AMOUNT Decimal("5") ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Proof(proof3);
CREATE_PROOF_FROM_AUTH_ZONE_BY_IDS Array<NonFungibleId>(NonFungibleId("hello")) ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Proof(proof4);
CREATE_PROOF_FROM_BUCKET Bucket(bucket2) Proof(proof5);
CLONE_PROOF Proof(proof5) Proof(proof6);
DROP_PROOF Proof(proof6);
CALL_FUNCTION PackageAddress("package_sim1qyqzcexvnyg60z7lnlwauh66nhzg3m8tch2j8wc0e70qkydk8r") "GumballMachine" "new" ;
CALL_METHOD ComponentAddress("account_sim1q02r73u7nv47h80e30pc3q6ylsj7mgvparm3pnsm780qgsy064") "withdraw_by_amount" Decimal("5") ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
CALL_NATIVE_FUNCTION "ResourceManger" "create" Enum("Fungible",0u8) Array<Tuple>() Array<Tuple>() Enum("Some",Enum("Fungible",Decimal("1")));
CALL_NATIVE_METHOD Global("component_sim1q2f9vmyrmeladvz0ejfttcztqv3genlsgpu9vue83mcs835hum") "claim_royalty" ;
PUBLISH_PACKAGE_WITH_OWNER Blob("985792bf3aa28de2793e33983607f4c39bed3e96626cb05a99fdc75caf2d111e") Blob("985792bf3aa28de2793e33983607f4c39bed3e96626cb05a99fdc75caf2d111e") NonFungibleAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag", 1u32);
CREATE_RESOURCE Enum("Fungible",0u8) Array<Tuple>() Array<Tuple>() Enum("Some",Enum("Fungible",Decimal("1")));
BURN_BUCKET Bucket(bucket1);
MINT_FUNGIBLE ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag") Decimal("5");
CALL_METHOD ComponentAddress("account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97") "withdraw" ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
CALL_METHOD ComponentAddress("account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97") "withdraw_by_amount" Decimal("5") ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");
CALL_METHOD ComponentAddress("account_sim1qwcwzxdr4s33ahvvjyvmeqeje5cepqu0ngset7xlukuq33gx97") "withdraw_by_ids" Array<NonFungibleId>(NonFungibleId(123u32)) ResourceAddress("resource_sim1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqu57yag");`)
  })
})
