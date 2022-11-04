/* eslint-disable max-nested-callbacks */
import { ok } from 'neverthrow'
import { transformMethodInput } from '../IO/transform-method-input'
import { requestItem } from '../wallet-sdk'
import { requestType } from '../_types'

describe('transformMethodInput', () => {
  describe('oneTimeAccountAddresses', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.oneTimeAccountAddresses.withoutProofOfOwnership(),
          expected: {
            requestType: requestType.oneTimeAccountAddresses,
            proofOfOwnership: false,
          },
        },
        {
          actual:
            requestItem.oneTimeAccountAddresses.withoutProofOfOwnership(3),
          expected: {
            requestType: requestType.oneTimeAccountAddresses,
            proofOfOwnership: false,
            numberOfAddresses: 3,
          },
        },
        {
          actual: requestItem.oneTimeAccountAddresses.withProofOfOwnership(),
          expected: {
            requestType: requestType.oneTimeAccountAddresses,
            proofOfOwnership: true,
          },
        },
        {
          actual: requestItem.oneTimeAccountAddresses.withProofOfOwnership(1),
          expected: {
            requestType: requestType.oneTimeAccountAddresses,
            proofOfOwnership: true,
            numberOfAddresses: 1,
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({}))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('ongoingAccountAddresses', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.ongoingAccountAddresses.withoutProofOfOwnership(),
          expected: {
            requestType: requestType.ongoingAccountAddresses,
            proofOfOwnership: false,
          },
        },
        {
          actual:
            requestItem.ongoingAccountAddresses.withoutProofOfOwnership(3),
          expected: {
            requestType: requestType.ongoingAccountAddresses,
            proofOfOwnership: false,
            numberOfAddresses: 3,
          },
        },
        {
          actual: requestItem.ongoingAccountAddresses.withProofOfOwnership(),
          expected: {
            requestType: requestType.ongoingAccountAddresses,
            proofOfOwnership: true,
          },
        },
        {
          actual: requestItem.ongoingAccountAddresses.withProofOfOwnership(1),
          expected: {
            requestType: requestType.ongoingAccountAddresses,
            proofOfOwnership: true,
            numberOfAddresses: 1,
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('login', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.login.withChallenge('abc'),
          expected: {
            requestType: requestType.login,
            challenge: 'abc',
          },
        },
        {
          actual: requestItem.login.withoutChallenge(),
          expected: {
            requestType: requestType.login,
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('persona', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.usePersona('abc'),
          expected: {
            requestType: requestType.persona,
            id: 'abc',
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('oneTimePersonaData', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.oneTimePersonaData('email'),
          expected: {
            requestType: requestType.oneTimePersonaData,
            fields: ['email'],
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('ongoingPersonaData', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.ongoingPersonaData('email'),
          expected: {
            requestType: requestType.ongoingPersonaData,
            fields: ['email'],
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('sendTransaction', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: {
            transactionManifest: 'test',
            version: 1,
            accountAddress: 'abc',
          },
          expected: {
            requestType: requestType.sendTransaction,
            transactionManifest: 'test',
            version: 1,
            accountAddress: 'abc',
          },
        },
      ].forEach((testItem) => {
        expect(
          transformMethodInput({ sendTransaction: testItem.actual })
        ).toEqual(ok([testItem.expected]))
      })
    })
  })
})
