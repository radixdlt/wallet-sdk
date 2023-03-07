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
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              requiresProofOfOwnership: false,
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withoutProofOfOwnership(3),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              requiresProofOfOwnership: false,
              numberOfAccounts: {
                quantity: 3,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(1),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(
            5,
            'exactly'
          ),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 5,
                quantifier: 'exactly',
              },
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              requiresProofOfOwnership: false,
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withoutProofOfOwnership(3),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              requiresProofOfOwnership: false,
              numberOfAccounts: {
                quantity: 3,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(5),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 5,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(
            10,
            'exactly'
          ),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              requiresProofOfOwnership: true,
              numberOfAccounts: {
                quantity: 10,
                quantifier: 'exactly',
              },
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'authorizedRequest',
            auth: {
              discriminator: 'login',
              challenge: 'abc',
            },
          },
        },
        {
          actual: requestItem.login.withoutChallenge(),
          expected: {
            discriminator: 'authorizedRequest',
            auth: {
              discriminator: 'login',
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'authorizedRequest',
            auth: {
              discriminator: 'usePersona',
              identityAddress: 'abc',
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimePersonaData.value]: {
              fields: ['email'],
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingPersonaData.value]: {
              fields: ['email'],
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
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
            discriminator: 'transaction',
            send: {
              transactionManifest: 'test',
              version: 1,
              accountAddress: 'abc',
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput({ send: testItem.actual })).toEqual(
          ok(testItem.expected)
        )
      })
    })
  })
  describe('reset', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: requestItem.reset({ accounts: true }),
          expected: {
            reset: { accounts: true, personaData: false },
            discriminator: 'unauthorizedRequest',
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual({} as any))).toEqual(
          ok(testItem.expected)
        )
      })
    })
  })
})
