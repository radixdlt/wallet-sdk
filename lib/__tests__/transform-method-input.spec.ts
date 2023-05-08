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
              discriminator: 'oneTimeAccountsWithoutProofOfOwnership',
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
              discriminator: 'oneTimeAccountsWithoutProofOfOwnership',
              numberOfAccounts: {
                quantity: 3,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership('test'),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              discriminator: 'oneTimeAccountsWithProofOfOwnership',
              challenge: 'test',
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership('test', 1),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              discriminator: 'oneTimeAccountsWithProofOfOwnership',
              challenge: 'test',
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.oneTimeAccounts.withProofOfOwnership(
            'test',
            5,
            'exactly'
          ),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimeAccounts.value]: {
              discriminator: 'oneTimeAccountsWithProofOfOwnership',
              challenge: 'test',
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
              discriminator: 'ongoingAccountsWithoutProofOfOwnership',
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
              discriminator: 'ongoingAccountsWithoutProofOfOwnership',
              numberOfAccounts: {
                quantity: 3,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership('test'),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              discriminator: 'ongoingAccountsWithProofOfOwnership',
              challenge: 'test',
              numberOfAccounts: {
                quantity: 1,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership('test', 5),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              discriminator: 'ongoingAccountsWithProofOfOwnership',
              challenge: 'test',
              numberOfAccounts: {
                quantity: 5,
                quantifier: 'atLeast',
              },
            },
          },
        },
        {
          actual: requestItem.ongoingAccounts.withProofOfOwnership(
            'test',
            10,
            'exactly'
          ),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingAccounts.value]: {
              discriminator: 'ongoingAccountsWithProofOfOwnership',
              challenge: 'test',
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
              discriminator: 'loginWithChallenge',
              challenge: 'abc',
            },
          },
        },
        {
          actual: requestItem.login.withoutChallenge(),
          expected: {
            discriminator: 'authorizedRequest',
            auth: {
              discriminator: 'loginWithoutChallenge',
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
          actual: requestItem.oneTimePersonaData('emailAddress'),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.oneTimePersonaData.value]: {
              fields: ['emailAddress'],
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
          actual: requestItem.ongoingPersonaData('emailAddress'),
          expected: {
            discriminator: 'unauthorizedRequest',
            [RequestTypeSchema.ongoingPersonaData.value]: {
              fields: ['emailAddress'],
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

  describe('personaData', () => {
    it('should return correct transformed value', () => {
      ;[
        {
          actual: {
            reset: {
              accounts: true,
              personaData: false,
            },
            oneTimePersonaData: {
              fields: [
                'givenName',
                'emailAddress',
                'familyName',
                'phoneNumber',
              ],
              oneTime: true,
            },
          },
          expected: {
            discriminator: 'unauthorizedRequest',
            oneTimePersonaData: {
              fields: [
                'givenName',
                'emailAddress',
                'familyName',
                'phoneNumber',
              ],
            },
          },
        },
      ].forEach((testItem) => {
        expect(transformMethodInput(testItem.actual)).toEqual(
          ok(testItem.expected)
        )
      })
    })
  })
})
