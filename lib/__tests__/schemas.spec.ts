import {
  AuthLoginRequestResponseItemSchema,
  AuthRequestItemSchema,
  OneTimeAccountsRequestResponseItemSchema,
  WalletInteractionFailureResponse,
  WalletInteractionFailureResponseSchema,
  WalletInteractionResponseSchema,
  WalletInteractionSchema,
} from '../IO/schemas'

describe('schemas', () => {
  it('OneTimeAccountsResponseItemSchema', () => {
    OneTimeAccountsRequestResponseItemSchema.parse({
      accounts: [
        {
          address: 'rdx61333732663539372d383861352d3461',
          label: 'address-0',
          appearanceId: 0,
        },
        {
          address: 'rdx34316364646264632d616434662d3463',
          label: 'address-1',
          appearanceId: 1,
        },
        {
          address: 'rdx34313261646463652d363539392d3462',
          label: 'address-2',
          appearanceId: 2,
        },
      ],
    })
  })

  describe('Auth', () => {
    it('AuthRequestItemSchema', () => {
      AuthRequestItemSchema.parse({
        discriminator: 'login',
        challenge: 'asd',
      })
      AuthRequestItemSchema.parse({
        discriminator: 'login',
      })
    })

    it('AuthLoginRequestResponseItemSchema', () => {
      AuthLoginRequestResponseItemSchema.parse({
        discriminator: 'loginWithChallenge',
        persona: {
          identityAddress: 'addr_xx',
          label: 'personaLabel',
        },
        challenge: 'challenge',
        publicKey: 'key',
        signature: 'signature',
      })
      AuthLoginRequestResponseItemSchema.parse({
        discriminator: 'loginWithoutChallenge',
        persona: {
          identityAddress:
            'account_tdx_b_1ql5kf246qrna76pdjp7jcg7y7rznsn6qq49xpzxtmvlqeklhwj',
          label: 'persona',
        },
      })
    })
  })

  describe('Wallet Interaction', () => {
    it('should parse authorized request', () => {
      WalletInteractionSchema.parse({
        items: {
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'usePersona',
            identityAddress: 'randomAddress1',
          },
          oneTimeAccounts: {
            requiresProofOfOwnership: false,
            numberOfAccounts: {
              quantity: 1,
              quantifier: 'exactly',
            },
          },
          ongoingAccounts: {
            requiresProofOfOwnership: true,
            numberOfAccounts: {
              quantity: 5,
              quantifier: 'atLeast',
            },
          },
        },
        interactionId: '4abe2cb1-93e2-467d-a854-5e2cec897c50',
        metadata: {
          networkId: 34,
          origin: 'https://dashboard-hammunet.rdx-works-main.extratools.works',
          dAppDefinitionAddress: 'dashboard',
        },
      })
    })
  })

  describe('Wallet Interaction Response', () => {
    it('should parse transaction response', () => {
      WalletInteractionResponseSchema.parse({
        discriminator: 'success',
        interactionId: 'abc',
        items: {
          discriminator: 'transaction',
          send: {
            transactionIntentHash: 'abc',
          },
        },
      })
    })

    it('should parse challenge unauthorized request response', () => {
      WalletInteractionResponseSchema.parse({
        discriminator: 'success',
        interactionId: 'abc',
        items: {
          discriminator: 'unauthorizedRequest',
          oneTimeAccounts: {
            accounts: [],
          },
          oneTimePersonaData: {
            fields: [
              {
                field: 'test',
                value: 'test',
              },
            ],
          },
        },
      })
    })

    it('should parse persona authorized request response', () => {
      WalletInteractionResponseSchema.parse({
        discriminator: 'success',
        interactionId: 'abc',
        items: {
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'usePersona',
            persona: {
              identityAddress:
                'account_tdx_b_1ql5kf246qrna76pdjp7jcg7y7rznsn6qq49xpzxtmvlqeklhwj',
              label: 'persona',
            },
          },
          ongoingPersonaData: {
            fields: [
              {
                field: 'test',
                value: 'test',
              },
            ],
          },
        },
      })

      WalletInteractionResponseSchema.parse({
        discriminator: 'success',
        interactionId: '3b96efd3-fdfc-4d53-a43c-3d190cd77277',
        items: {
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'loginWithoutChallenge',
            persona: {
              identityAddress:
                'account_tdx_b_1ql5kf246qrna76pdjp7jcg7y7rznsn6qq49xpzxtmvlqeklhwj',
              label: 'persona',
            },
          },
          ongoingAccounts: {
            accounts: [
              {
                address:
                  'account_tdx_b_1qlljmf2m0tge4qk8k2e4vkuyhw6hjwf6k02rtgs3gewsfmn8fs',
                label: '234',
                appearanceId: 0,
              },
            ],
          },
        },
      })
      WalletInteractionResponseSchema.parse({
        interactionId: 'd4c76fd0-1881-4e0b-87e5-0b6e3e58c360',
        discriminator: 'success',
        items: {
          discriminator: 'unauthorizedRequest',
          oneTimeAccounts: {
            accounts: [
              {
                address:
                  'account_tdx_b_1q7v5vaj2jxf9pm5ndzqvfd925sukk0x7xlhfghn9apxq88agsg',
                label: '1',
                appearanceId: 0,
              },
            ],
          },
        },
      })
    })

    it('should parse error without message', () => {
      const errorWithoutMessage: WalletInteractionFailureResponse = {
        discriminator: 'failure',
        interactionId: 'rdx61333732663539372d383861352d3461',
        error: 'submittedTransactionHasRejectedTransactionStatus',
      }

      WalletInteractionResponseSchema.parse(errorWithoutMessage)
    })

    it('should parse error with message', () => {
      const errorWithMessage: WalletInteractionFailureResponse = {
        discriminator: 'failure',
        interactionId: 'rdx61333732663539372d383861352d3461',
        error: 'failedToCompileTransaction',
        message: 'TXID: rdx123',
      }
      WalletInteractionResponseSchema.parse(errorWithMessage)
    })

    it('should throw when unknown error is provided', () => {
      expect(() =>
        WalletInteractionFailureResponseSchema.parse({
          discriminator: 'failure',
          interactionId: 'rdx61333732663539372d383861352d3461',
          error: 'unknown',
          message: 'TXID: rdx123',
        })
      ).toThrow()
    })
  })
})
