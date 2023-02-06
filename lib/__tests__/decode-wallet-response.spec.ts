import { decodeWalletResponse } from '../IO/decode-wallet-response'
import { WalletInteractionSuccessResponse } from '../IO/schemas'

describe('decodeWalletResponse', () => {
  it('should output correct value', () => {
    ;[
      {
        input: {
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'usePersona',
            persona: { identityAddress: 'addr_xxx' },
          },
          oneTimeAccounts: {
            accounts: [
              { label: 'main account', address: 'abc', appearanceId: 0 },
            ],
          },
          ongoingAccounts: {
            accounts: [
              { label: 'main account', address: 'abc', appearanceId: 1 },
            ],
          },
          oneTimePersonaData: {
            fields: [{ field: 'email', value: 'abc' }],
          },
          ongoingPersonaData: {
            fields: [{ field: 'email', value: 'abc' }],
          },
        },
        expected: {
          persona: {
            identityAddress: 'addr_xxx',
          },
          oneTimeAccounts: [
            { label: 'main account', address: 'abc', appearanceId: 0 },
          ],
          ongoingAccounts: [
            { label: 'main account', address: 'abc', appearanceId: 1 },
          ],
          oneTimePersonaData: [{ field: 'email', value: 'abc' }],
          ongoingPersonaData: [{ field: 'email', value: 'abc' }],
        },
      },
      {
        input: {
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'loginWithChallenge',
            persona: {
              identityAddress: 'addr_xxx',
              label: 'personaLabel',
            },
            challenge: 'challenge',
            publicKey: 'publicKey',
            signature: 'signature',
          },
        },
        expected: {
          persona: {
            identityAddress: 'addr_xxx',
            label: 'personaLabel',
          },
          signedChallenge: {
            challenge: 'challenge',
            publicKey: 'publicKey',
            signature: 'signature',
          },
        },
      },
      {
        input: {
          discriminator: 'unauthorizedRequest',
          oneTimeAccounts: {
            accounts: [],
          },
          oneTimePersonaData: {
            fields: [
              {
                field: 'field',
                value: 'value',
              },
            ],
          },
        },
        expected: {
          oneTimeAccounts: [],
          oneTimePersonaData: [
            {
              field: 'field',
              value: 'value',
            },
          ],
        },
      },
      {
        input: {
          discriminator: 'transaction',
          send: {
            transactionIntentHash: 'txId',
          },
        },
        expected: {
          transactionIntentHash: 'txId',
        },
      },
    ].forEach(({ input, expected }) => {
      expect(
        decodeWalletResponse(input as WalletInteractionSuccessResponse['items'])
      ).toEqual(expected)
    })
  })
})
