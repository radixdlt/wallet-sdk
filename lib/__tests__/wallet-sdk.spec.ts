/* eslint-disable max-params */
/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import WalletSdk, { Network, WalletSdk as WalletSdkType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { messageLifeCycleEvent } from '../messages/events/_types'

import { OneTimeAccounts } from '../IO/request-items/one-time-accounts'
import { WalletInteractionSuccessResponse } from '../IO/schemas'

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
  let sdk: WalletSdkType
  beforeEach(() => {
    sdk = WalletSdk({
      dAppDefinitionAddress: 'radixDashboard',
      logLevel: 'debug',
    })
  })

  afterEach(() => {
    log.setLevel('silent')
    sdk.destroy()
  })

  const createRequestHelper = (
    input: () => ReturnType<WalletSdkType['request']>
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
