/* eslint-disable array-callback-return */
/* eslint-disable max-nested-callbacks */
import { RadixSdk, RadixSdkType } from '../sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'
import log from 'loglevel'
import { testHelper } from '../test-utils/helper'
import { ok } from 'neverthrow'

let sdk: RadixSdkType

describe('sdk flow', () => {
  beforeEach(() => {
    log.setLevel('silent')
    sdk = RadixSdk()
    log.setLevel('debug')
  })

  afterEach(() => {
    log.setLevel('silent')
    sdk.destroy()
  })

  describe('request', () => {
    describe('happy paths', () => {
      it('should send request and receive response from observable', () => {
        const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')

        const outgoingMessageSpy = subscribeSpyTo(
          sdk.__subjects.outgoingMessageSubject
        )

        const addressRequest = {
          accountAddress: {},
        }

        const requestSpy = subscribeSpyTo(
          sdk.request(addressRequest).observable$
        )
        expect(eventDispatchSpy).toBeCalled()

        const outgoingMessage = outgoingMessageSpy.getFirstValue()

        const incomingMessage = testHelper.createRequestReponse(
          outgoingMessage.requestId,
          [testHelper.createAccountAddressResponse(1)]
        )

        sdk.__subjects.incomingMessageSubject.next(incomingMessage)

        if ('method' in incomingMessage) {
          expect(requestSpy.getValues()).toEqual([ok(incomingMessage.payload)])
        }
      })

      it('should send request and receive response from promise', (done) => {
        const eventDispatchSpy = jest.spyOn(globalThis, 'dispatchEvent')

        const outgoingMessageSpy = subscribeSpyTo(
          sdk.__subjects.outgoingMessageSubject
        )

        const addressRequest = {
          accountAddress: { ongoing: false, numberOfAddresses: 1 },
        }

        sdk
          .request(addressRequest)
          .promise()
          .map((message) => {
            if ('method' in message && 'method' in incomingMessage) {
              expect(message).toEqual(incomingMessage.payload)
              done()
            }
          })

        expect(eventDispatchSpy).toBeCalled()

        const outgoingMessage = outgoingMessageSpy.getFirstValue()

        const incomingMessage = testHelper.createRequestReponse(
          outgoingMessage.requestId,
          [testHelper.createAccountAddressResponse(1)]
        )
        sdk.__subjects.incomingMessageSubject.next(incomingMessage)
      })
    })
  })
})
