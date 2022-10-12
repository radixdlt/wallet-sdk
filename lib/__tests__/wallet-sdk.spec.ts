/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import WalletSdk, { Network, WalletSdk as WalletSdkType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { testHelper } from '../test-utils/helper'
import { messageLifeCycleEvent } from '../messages/events/_types'
import { requestType } from '../methods'

let sdk: WalletSdkType

describe('sdk flow', () => {
  beforeEach(() => {
    log.setLevel('silent')
    sdk = WalletSdk()
    log.setLevel('debug')
  })

  afterEach(() => {
    log.setLevel('silent')
    sdk.destroy()
  })

  describe('request', () => {
    describe('happy paths', () => {
      it('should send request and receive response', (done) => {
        const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')

        const outgoingMessageSpy = subscribeSpyTo(
          sdk.__subjects.outgoingMessageSubject
        )

        const messageEventSpy = subscribeSpyTo(
          sdk.__subjects.messageLifeCycleEventSubject
        )

        const callbackSpy = jest.fn()

        const addresses = testHelper.createAccountAddressResponse(3)

        sdk
          .request(
            {
              accountAddresses: {},
              personaData: { fields: ['email'] },
            },
            callbackSpy
          )
          .map((message) => {
            expect(message.accountAddresses).toEqual(addresses.addresses)
            expect(message.personaData).toEqual([
              { field: 'email', value: 'alex@rdx.works' },
            ])
            done()
          })

        expect(eventDispatchSpy).toBeCalled()

        const outgoingMessage = outgoingMessageSpy.getFirstValue()

        expect(outgoingMessage.metadata.networkId).toBe(Network.mainnet)

        sdk.__subjects.incomingMessageSubject.next({
          requestId: outgoingMessage.requestId,
          eventType: messageLifeCycleEvent.receivedByExtension,
        })

        const incomingMessage = testHelper.createRequestReponse(
          outgoingMessage.requestId,
          [
            addresses,
            {
              requestType: requestType.personaData,
              personaData: [{ field: 'email', value: 'alex@rdx.works' }],
            },
          ]
        )

        sdk.__subjects.incomingMessageSubject.next(incomingMessage)

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
})
