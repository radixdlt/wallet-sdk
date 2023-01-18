/* eslint-disable max-nested-callbacks */
import { ok } from 'neverthrow'
import { RequestTypeSchema } from '../IO/schemas'
import { transformMethodInput } from '../IO/transform-method-input'
import { requestItem } from '../wallet-sdk'

describe('transformMethodInput', () => {
  describe('oneTimeAccounts', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.oneTimeAccounts.withoutProofOfOwnership(),
          expected: {
            requestType: RequestTypeSchema.oneTimeAccountsRead.value,
            requiresProofOfOwnership: false,
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withoutProofOfOwnership(3),
          expected: {
            requestType: RequestTypeSchema.oneTimeAccountsRead.value,
            requiresProofOfOwnership: false,
            numberOfAccounts: 3,
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(),
          expected: {
            requestType: RequestTypeSchema.oneTimeAccountsRead.value,
            requiresProofOfOwnership: true,
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(1),
          expected: {
            requestType: RequestTypeSchema.oneTimeAccountsRead.value,
            requiresProofOfOwnership: true,
            numberOfAccounts: 1,
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('ongoingAccounts', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.ongoingAccounts.withoutProofOfOwnership(),
          expected: {
            requestType: RequestTypeSchema.ongoingAccountsRead.value,
            requiresProofOfOwnership: false,
            numberOfAccounts: undefined,
          },
        },
        {
          actual: requestItem.ongoingAccounts.withoutProofOfOwnership(3),
          expected: {
            requestType: RequestTypeSchema.ongoingAccountsRead.value,
            requiresProofOfOwnership: false,
            numberOfAccounts: 3,
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(),
          expected: {
            requestType: RequestTypeSchema.ongoingAccountsRead.value,
            requiresProofOfOwnership: true,
            numberOfAccounts: undefined,
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(1),
          expected: {
            requestType: RequestTypeSchema.ongoingAccountsRead.value,
            requiresProofOfOwnership: true,
            numberOfAccounts: 1,
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
            requestType: RequestTypeSchema.loginRead.value,
            challenge: 'abc',
          },
        },
        {
          actual: requestItem.login.withoutChallenge(),
          expected: {
            requestType: RequestTypeSchema.loginRead.value,
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok([testItem.expected])
        )
      })
    })
  })
  describe('usePersona', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.usePersona('abc'),
          expected: {
            requestType: RequestTypeSchema.usePersonaRead.value,
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
            requestType: RequestTypeSchema.oneTimePersonaDataRead.value,
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
            requestType: RequestTypeSchema.ongoingPersonaDataRead.value,
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
            requestType: RequestTypeSchema.sendTransactionWrite.value,
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
