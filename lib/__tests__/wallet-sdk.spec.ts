/* eslint-disable max-params */
/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import WalletSdk, { Network, WalletSdk as WalletSdkType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { messageLifeCycleEvent } from '../messages/events/_types'

import { OneTimeAccounts } from '../IO/request-items/one-time-accounts'
import { WalletSuccessResponse } from '../IO/schemas'

const mockAccountWalletResponse: OneTimeAccounts['WithoutProofOfOwnership']['wallet']['response'] =
  {
    requestType: 'oneTimeAccountsRead',
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
    sdk = WalletSdk({ dAppId: 'radixDashboard', logLevel: 'debug' })
  })

  afterEach(() => {
    log.setLevel('silent')
    sdk.destroy()
  })

  const createRequestHelper = async <I extends {}>({
    input,
    walletResponse,
    eventCallback,
    callback,
  }: {
    input: I
    walletResponse: WalletSuccessResponse['items']
    eventCallback?: () => void
    callback: (error: any, message: any) => void
  }) => {
    const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')
    const outgoingMessageSpy = subscribeSpyTo(
      sdk.__subjects.outgoingMessageSubject
    )
    const messageEventSpy = subscribeSpyTo(
      sdk.__subjects.messageLifeCycleEventSubject
    )

    sdk
      .request(input, eventCallback)
      .map((response) => callback(null, response))
      .mapErr((err) => {
        callback(err, null)
      })

    await delay(0)

    expect(eventDispatchSpy).toBeCalled()

    const outgoingMessage = outgoingMessageSpy.getFirstValue()
    sendReceivedEvent(outgoingMessage.requestId)

    sdk.__subjects.incomingMessageSubject.next({
      items: walletResponse,
      requestId: outgoingMessage.requestId,
    })

    return {
      outgoingMessage,
      getMessageEvents: () => messageEventSpy.getValues(),
    }
  }

  const sendReceivedEvent = (requestId: string) => {
    sdk.__subjects.incomingMessageSubject.next({
      requestId,
      eventType: messageLifeCycleEvent.receivedByExtension,
    })
  }

  describe('request method', () => {
    it('should request account addresses and persona data', (done) => {
      const walletResponse = [mockAccountWalletResponse]

      const callbackSpy = jest.fn()

      createRequestHelper({
        input: {
          oneTimeAccountsWithoutProofOfOwnership: {},
        },
        walletResponse,
        eventCallback: callbackSpy,
        callback: (error, response) => {
          if (error) {
            throw error
          }
          expect({
            oneTimeAccounts: mockAccountWalletResponse.accounts,
          }).toEqual(response)
          done()
        },
      }).then(({ outgoingMessage, getMessageEvents }) => {
        expect(outgoingMessage.metadata.networkId).toBe(Network.Mainnet)

        expect(getMessageEvents()).toEqual([
          {
            requestId: outgoingMessage.requestId,
            eventType: messageLifeCycleEvent.receivedByExtension,
          },
        ])

        expect(callbackSpy).toHaveBeenCalledWith(
          messageLifeCycleEvent.receivedByExtension
        )
      })
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
          callbackSpy
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
          requestId: outgoingMessage.requestId,
          eventType: messageLifeCycleEvent.receivedByExtension,
        })

        sdk.__subjects.incomingMessageSubject.next({
          requestId: outgoingMessage.requestId,
          items: [
            {
              requestType: 'sendTransactionWrite',
              transactionIntentHash: 'testHash',
            },
          ],
        })

        expect(messageEventSpy.getValues()).toEqual([
          {
            requestId: outgoingMessage.requestId,
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
