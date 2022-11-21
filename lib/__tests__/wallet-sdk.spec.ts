/* eslint-disable max-params */
/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import WalletSdk, { Network, WalletSdk as WalletSdkType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { messageLifeCycleEvent } from '../messages/events/_types'

import { OneTimeAccountAddresses } from '../IO/request-items/one-time-account-addresses'
import { Wallet } from '../_types'

const mockAccountAddressesWalletResponse: OneTimeAccountAddresses['wallet']['response'] =
  {
    requestType: 'oneTimeAccountAddresses',
    proofOfOwnership: false,
    accountAddresses: [
      {
        address: 'rdx61333732663539372d383861352d3461',
        label: 'address-0',
      },
      {
        address: 'rdx34316364646264632d616434662d3463',
        label: 'address-1',
      },
      {
        address: 'rdx34313261646463652d363539392d3462',
        label: 'address-2',
      },
    ],
  }

describe('sdk flow', () => {
  let sdk: WalletSdkType
  beforeEach(() => {
    log.setLevel('silent')
    sdk = WalletSdk({ dAppId: 'radixDashboard' })
    log.setLevel('debug')
  })

  afterEach(() => {
    log.setLevel('silent')
    sdk.destroy()
  })

  const createRequestHelper = <I extends {}>({
    input,
    walletResponse,
    eventCallback,
    callback,
  }: {
    input: I
    walletResponse: Wallet['response']
    eventCallback?: () => void
    callback: (message: any) => void
  }) => {
    const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')
    const outgoingMessageSpy = subscribeSpyTo(
      sdk.__subjects.outgoingMessageSubject
    )
    const messageEventSpy = subscribeSpyTo(
      sdk.__subjects.messageLifeCycleEventSubject
    )

    sdk.request(input, eventCallback).map(callback)

    expect(eventDispatchSpy).toBeCalled()

    const outgoingMessage = outgoingMessageSpy.getFirstValue()
    sendReceivedEvent(outgoingMessage.requestId)

    sdk.__subjects.incomingMessageSubject.next({
      payload: walletResponse,
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
      const walletResponse = [mockAccountAddressesWalletResponse]

      const callbackSpy = jest.fn()

      const { outgoingMessage, getMessageEvents } = createRequestHelper({
        input: {
          oneTimeAccountAddresses: {},
        },
        walletResponse,
        eventCallback: callbackSpy,
        callback: (response) => {
          expect({
            oneTimeAccountAddresses:
              mockAccountAddressesWalletResponse.accountAddresses,
          }).toEqual(response)
          done()
        },
      })

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

      expect(eventDispatchSpy).toBeCalled()

      const outgoingMessage = outgoingMessageSpy.getFirstValue()

      expect(outgoingMessage.metadata.networkId).toBe(Network.Mainnet)

      sdk.__subjects.incomingMessageSubject.next({
        requestId: outgoingMessage.requestId,
        eventType: messageLifeCycleEvent.receivedByExtension,
      })

      sdk.__subjects.incomingMessageSubject.next({
        requestId: outgoingMessage.requestId,
        payload: [
          { requestType: 'sendTransaction', transactionIntentHash: 'testHash' },
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
    })
  })
})
