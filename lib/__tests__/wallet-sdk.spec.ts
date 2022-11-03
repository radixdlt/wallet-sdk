/* eslint-disable max-params */
/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import WalletSdk, { Network, WalletSdk as WalletSdkType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { messageLifeCycleEvent } from '../messages/events/_types'
import {
  RequestMethodInput,
  RequestMethodResponse,
  RequestWalletResponse,
} from '../methods'
import { IncomingMessage } from '../messages'

const mockAccountAddressesWalletResponse: RequestWalletResponse['accountAddresses'] =
  {
    requestType: 'accountAddresses',
    addresses: [
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

const mockPersonaDataWalletResponse: RequestWalletResponse['personaData'] = {
  requestType: 'personaData',
  personaData: [{ field: 'email', value: 'alex@rdx.works' }],
}

const mockLoginWalletResponse: RequestWalletResponse['login'] = {
  requestType: 'login',
  challenge: '60ffcd3fae6e57b5fbbc2ac241250575f342dfb8287499171a322a5aaf56ee20',
  publicKey: '<<TEST_PUBLIC_KEY>>',
  identityComponentAddress: '<<TEST_IDENTITY_ADDRESS>>',
  signature: '<<TEST_SIGNATURE>>',
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

  const createRequestHelper = ({
    input,
    walletResponse,
    eventCallback,
    callback,
  }: {
    input: RequestMethodInput
    walletResponse: Omit<IncomingMessage['request'], 'requestId'>
    eventCallback?: () => void
    callback: (message: RequestMethodResponse) => void
  }) => {
    const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')
    const outgoingMessageSpy = subscribeSpyTo(
      sdk.__subjects.outgoingMessageSubject
    )
    const messageEventSpy = subscribeSpyTo(
      sdk.__subjects.messageLifeCycleEventSubject
    )

    sdk.request(input, eventCallback).map((response) => {
      callback(response)
    })

    expect(eventDispatchSpy).toBeCalled()

    const outgoingMessage = outgoingMessageSpy.getFirstValue()
    sendReceivedEvent(outgoingMessage.requestId)

    sdk.__subjects.incomingMessageSubject.next({
      ...walletResponse,
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
      const walletResponse: Omit<IncomingMessage['request'], 'requestId'> = {
        method: 'request',
        payload: [
          mockAccountAddressesWalletResponse,
          mockPersonaDataWalletResponse,
        ],
      }

      const callbackSpy = jest.fn()

      const { outgoingMessage, getMessageEvents } = createRequestHelper({
        input: {
          accountAddresses: {},
          personaData: {
            fields: ['email'],
          },
        },
        walletResponse,
        eventCallback: callbackSpy,
        callback: (response) => {
          expect({
            accountAddresses: mockAccountAddressesWalletResponse.addresses,
            personaData: mockPersonaDataWalletResponse.personaData,
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
    it('should handle login request', (done) => {
      const walletResponse: Omit<IncomingMessage['request'], 'requestId'> = {
        method: 'request',
        payload: [mockLoginWalletResponse],
      }

      createRequestHelper({
        input: {
          login: {
            challenge:
              '60ffcd3fae6e57b5fbbc2ac241250575f342dfb8287499171a322a5aaf56ee20',
          },
        },
        walletResponse,
        callback: (response) => {
          const { requestType, ...expected } = mockLoginWalletResponse
          expect({ login: expected }).toEqual(response)
          done()
        },
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
            accountAddress: 'abc123',
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
        method: 'sendTransaction',
        payload: { transactionIntentHash: 'testHash' },
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
