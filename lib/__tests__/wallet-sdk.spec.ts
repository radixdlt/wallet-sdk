/* eslint-disable max-params */
/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import { Network, WalletSdk } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import { messageLifeCycleEvent } from '../messages/events/_types'

import { OneTimeAccounts } from '../IO/request-items/one-time-accounts'
import { WalletInteractionSuccessResponse } from '../IO/schemas'
import { createLogger } from '../helpers/logger'

const mockAccountWalletResponse: OneTimeAccounts['WithoutProofOfOwnership']['wallet']['response'] =
  {
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
  }

const delay = (millis: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })

describe('sdk flow', () => {
  let sdk: WalletSdk
  let logger = createLogger(1)
  beforeEach(() => {
    logger.settings.minLevel = 1
    sdk = WalletSdk({
      dAppDefinitionAddress: 'radixDashboard',
      logger,
    })
  })

  afterEach(() => {
    logger.settings.minLevel = 4
    sdk.destroy()
  })

  const createRequestHelper = (
    input: () => ReturnType<WalletSdk['request']>
  ) => {
    const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')
    const outgoingMessageSpy = subscribeSpyTo(
      sdk.__subjects.outgoingMessageSubject
    )
    const messageEventSpy = subscribeSpyTo(
      sdk.__subjects.messageLifeCycleEventSubject
    )

    const request = input()

    let interactionId: string | undefined

    delay(0).then(() => {
      expect(eventDispatchSpy).toBeCalled()
      const outgoingMessage = outgoingMessageSpy.getFirstValue()
      interactionId = outgoingMessage.interactionId
      sendReceivedEvent(outgoingMessage.interactionId)
    })

    const getinteractionId = () => interactionId!

    return {
      getMessageEvents: () => messageEventSpy.getValues(),
      getinteractionId,
      outgoingMessageSpy,
      sendIncomingMessage: (
        walletResponse: WalletInteractionSuccessResponse['items']
      ) => {
        sdk.__subjects.incomingMessageSubject.next({
          discriminator: 'success',
          items: walletResponse,
          interactionId: getinteractionId(),
        })
      },
      request,
    }
  }

  const sendReceivedEvent = (interactionId: string) => {
    sdk.__subjects.incomingMessageSubject.next({
      interactionId,
      eventType: messageLifeCycleEvent.receivedByExtension,
    })
  }

  describe('request method', () => {
    it('should cancel request', async () => {
      let cancel: (() => void) | undefined

      const { request } = createRequestHelper(() =>
        sdk.request(
          { oneTimeAccountsWithoutProofOfOwnership: {} },
          {
            requestControl: ({ cancelRequest }) => {
              cancel = cancelRequest
            },
          }
        )
      )

      // trigger a request cancelation
      delay(300).then(() => {
        cancel!()
      })

      const result = await request

      if (result.isOk()) throw new Error('should not get a success response')

      expect(result.error.error).toBe('canceledByUser')
    })

    it('should request account addresses and persona data', async () => {
      const callbackSpy = jest.fn()

      const { request, sendIncomingMessage, outgoingMessageSpy } =
        createRequestHelper(() =>
          sdk.request(
            { oneTimeAccountsWithoutProofOfOwnership: {} },
            {
              eventCallback: callbackSpy,
            }
          )
        )

      // mock a wallet response
      delay(300).then(() => {
        sendIncomingMessage({
          discriminator: 'unauthorizedRequest',
          oneTimeAccounts: mockAccountWalletResponse,
        })
      })

      const result = await request

      if (result.isErr()) throw new Error('should not get a error response')

      expect((result.value as any).oneTimeAccounts).toEqual(
        mockAccountWalletResponse.accounts
      )

      expect(outgoingMessageSpy.getFirstValue().metadata).toEqual({
        dAppDefinitionAddress: 'radixDashboard',
        networkId: 1,
      })

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })

    it('should request ongoing accounts and login', async () => {
      const callbackSpy = jest.fn()

      const { request, sendIncomingMessage, outgoingMessageSpy } =
        createRequestHelper(() =>
          sdk.request(
            {
              loginWithoutChallenge: {},
              ongoingAccountsWithoutProofOfOwnership: {
                quantifier: 'atLeast',
                quantity: 1,
              },
            },
            {
              eventCallback: callbackSpy,
            }
          )
        )

      // mock a wallet response
      delay(300).then(() => {
        sendIncomingMessage({
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'loginWithoutChallenge',
            persona: {
              identityAddress:
                'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y',
              label: '2nd persona',
            },
          },
          ongoingAccounts: {
            accounts: [
              {
                address:
                  'account_tdx_b_1qaz0nxslmr9nssmy463rd57hl7q0xsadaal0gy7cwsuqwecaws',
                label: 'Jakub Another Accoun',
                appearanceId: 1,
              },
              {
                address:
                  'account_tdx_b_1q7te4nk60fy2wt7d0wh8l2dhlp5c0n75phcnrwa8uglsrf6sjr',
                label: '3rd Account',
                appearanceId: 2,
              },
            ],
          },
        })
      })

      const result = await request

      if (result.isErr()) throw new Error('should not get a error response')
      expect((result.value as any).ongoingAccounts).toEqual([
        {
          address:
            'account_tdx_b_1qaz0nxslmr9nssmy463rd57hl7q0xsadaal0gy7cwsuqwecaws',
          label: 'Jakub Another Accoun',
          appearanceId: 1,
        },
        {
          address:
            'account_tdx_b_1q7te4nk60fy2wt7d0wh8l2dhlp5c0n75phcnrwa8uglsrf6sjr',
          label: '3rd Account',
          appearanceId: 2,
        },
      ])

      expect((result.value as any).persona.identityAddress).toEqual(
        'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y'
      )

      expect(outgoingMessageSpy.getFirstValue().metadata).toEqual({
        dAppDefinitionAddress: 'radixDashboard',
        networkId: 1,
      })

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })
    it('should request usePersona', async () => {
      const callbackSpy = jest.fn()

      const { request, sendIncomingMessage } = createRequestHelper(() =>
        sdk.request(
          {
            usePersona: {
              identityAddress:
                'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y',
            },
          },
          {
            eventCallback: callbackSpy,
          }
        )
      )

      sdk
        .request(
          {
            usePersona: {
              identityAddress:
                'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y',
            },
          },
          {
            eventCallback: callbackSpy,
          }
        )
        .map((result) => result.persona)

      // mock a wallet response
      delay(300).then(() => {
        sendIncomingMessage({
          discriminator: 'authorizedRequest',
          auth: {
            discriminator: 'usePersona',
            persona: {
              identityAddress:
                'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y',
              label: '2nd persona',
            },
          },
        })
      })

      const result = await request

      if (result.isErr()) throw new Error('should not get a error response')
      expect((result.value as any).persona.identityAddress).toEqual(
        'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y'
      )

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })
  })

  describe('send transaction method', () => {
    it('should send transaction and receive transaction intent hash', (done) => {
      const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')

      const outgoingMessageSpy = subscribeSpyTo(
        sdk.__subjects.outgoingMessageSubject
      )

      const messageEventSpy = subscribeSpyTo(
        sdk.__subjects.messageLifeCycleEventSubject
      )

      const callbackSpy = jest.fn()

      sdk
        .sendTransaction(
          {
            transactionManifest: `test transaction manifest`,
            version: 1,
          },
          { eventCallback: callbackSpy }
        )
        .map((message) => {
          expect(message.transactionIntentHash).toEqual('testHash')
          done()
        })

      setTimeout(() => {
        expect(eventDispatchSpy).toBeCalled()

        const outgoingMessage = outgoingMessageSpy.getFirstValue()

        expect(outgoingMessage.metadata.networkId).toBe(Network.Mainnet)

        sdk.__subjects.incomingMessageSubject.next({
          interactionId: outgoingMessage.interactionId,
          eventType: messageLifeCycleEvent.receivedByExtension,
        })

        sdk.__subjects.incomingMessageSubject.next({
          discriminator: 'success',
          interactionId: outgoingMessage.interactionId,
          items: {
            discriminator: 'transaction',
            send: {
              transactionIntentHash: 'testHash',
            },
          },
        })

        expect(messageEventSpy.getValues()).toEqual([
          {
            interactionId: outgoingMessage.interactionId,
            eventType: messageLifeCycleEvent.receivedByExtension,
          },
        ])

        expect(callbackSpy).toHaveBeenCalledWith(
          messageLifeCycleEvent.receivedByExtension
        )
      }, 1)
    })
  })
})
