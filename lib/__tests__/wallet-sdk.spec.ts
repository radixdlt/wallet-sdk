import { WalletSdk, messageLifeCycleEventType } from '../wallet-sdk'
import { subscribeSpyTo } from '@hirez_io/observer-spy'

import { createLogger } from '../helpers/logger'
import { ConnectorExtensionClient } from '../connector-extension/connector-extension-client'
import { Subjects } from '../connector-extension/subjects'
import { WalletInteractionSuccessResponse } from '../IO/v1/schemas'

const delay = (millis: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })

let subjects: Subjects
let connectorExtensionClient: ConnectorExtensionClient

describe('sdk flow', () => {
  let sdk: WalletSdk
  let logger = createLogger(1)
  beforeEach(() => {
    logger.settings.minLevel = 1
    subjects = Subjects()
    connectorExtensionClient = ConnectorExtensionClient({ subjects, logger })

    sdk = WalletSdk({
      dAppDefinitionAddress: 'radixDashboard',
      logger,
      version: 2,
      networkId: 12,
      providers: { connectorExtensionClient },
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
    const outgoingMessageSpy = subscribeSpyTo(subjects.outgoingMessageSubject)
    const messageEventSpy = subscribeSpyTo(
      subjects.messageLifeCycleEventSubject
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
        subjects.incomingMessageSubject.next({
          discriminator: 'success',
          items: walletResponse,
          interactionId: getinteractionId(),
        })
      },
      request,
    }
  }

  const sendReceivedEvent = (interactionId: string) => {
    subjects.incomingMessageSubject.next({
      interactionId,
      eventType: messageLifeCycleEventType.receivedByExtension,
    })
  }

  describe('request method', () => {
    it('should cancel request', async () => {
      let cancel: (() => void) | undefined

      const { request, outgoingMessageSpy } = createRequestHelper(() =>
        sdk.request(
          {
            discriminator: 'unauthorizedRequest',
            oneTimeAccounts: {
              numberOfAccounts: { quantifier: 'atLeast', quantity: 1 },
            },
          },
          {
            requestControl: ({ cancelRequest }) => {
              cancel = cancelRequest
            },
          }
        )
      )

      // trigger a request cancelation
      await delay(1)

      cancel!()

      await delay(1)

      subjects.incomingMessageSubject.next({
        interactionId: outgoingMessageSpy.getFirstValue().interactionId,
        eventType: messageLifeCycleEventType.requestCancelSuccess,
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
            {
              discriminator: 'unauthorizedRequest',
              oneTimeAccounts: {
                numberOfAccounts: { quantifier: 'atLeast', quantity: 1 },
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
          discriminator: 'unauthorizedRequest',
          oneTimeAccounts: {
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
          },
        })
      })

      const result = await request

      if (result.isErr()) throw new Error('should not get a error response')

      expect(result.value).toEqual({
        discriminator: 'unauthorizedRequest',
        oneTimeAccounts: {
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
        },
      })

      expect(outgoingMessageSpy.getFirstValue().metadata).toEqual({
        dAppDefinitionAddress: 'radixDashboard',
        networkId: 12,
        version: 2,
      })

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })

    it('should request ongoing accounts and login', async () => {
      const callbackSpy = jest.fn()

      const { request, sendIncomingMessage, outgoingMessageSpy } =
        createRequestHelper(() =>
          sdk.request(
            {
              discriminator: 'authorizedRequest',
              auth: {
                discriminator: 'loginWithoutChallenge',
              },
              ongoingAccounts: {
                numberOfAccounts: {
                  quantifier: 'atLeast',
                  quantity: 1,
                },
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
      expect((result.value as any).ongoingAccounts).toEqual({
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
      })

      expect((result.value as any).auth.persona.identityAddress).toEqual(
        'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y'
      )

      expect(outgoingMessageSpy.getFirstValue().metadata).toEqual({
        dAppDefinitionAddress: 'radixDashboard',
        networkId: 12,
        version: 2,
      })

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })

    it('should request usePersona', async () => {
      const callbackSpy = jest.fn()

      const { request, sendIncomingMessage } = createRequestHelper(() =>
        sdk.request(
          {
            discriminator: 'authorizedRequest',
            auth: {
              discriminator: 'usePersona',
              identityAddress:
                'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y',
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
        })
      })

      const result = await request

      if (result.isErr()) throw new Error('should not get a error response')
      expect((result.value as any).auth.persona.identityAddress).toEqual(
        'account_tdx_b_1qlu8fdyj77jpmu2mqe4rgh3738jcva4nfd2y2vp675zqgdg72y'
      )

      expect(callbackSpy).toBeCalledWith('receivedByExtension')
    })
  })

  describe('send transaction method', () => {
    it('should send transaction and receive transaction intent hash', (done) => {
      const outgoingMessageSpy = subscribeSpyTo(subjects.outgoingMessageSubject)

      const messageEventSpy = subscribeSpyTo(
        subjects.messageLifeCycleEventSubject
      )

      const callbackSpy = jest.fn()

      sdk
        .sendTransaction(
          {
            transactionManifest: `test transaction manifest`,
            version: 2,
          },
          { eventCallback: callbackSpy }
        )
        .map((message) => {
          expect(message.transactionIntentHash).toEqual('testHash')
          done()
        })

      setTimeout(() => {
        const outgoingMessage = outgoingMessageSpy.getFirstValue()

        expect(outgoingMessage.metadata.networkId).toBe(12)

        subjects.incomingMessageSubject.next({
          interactionId: outgoingMessage.interactionId,
          eventType: messageLifeCycleEventType.receivedByExtension,
        })

        subjects.incomingMessageSubject.next({
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
            eventType: messageLifeCycleEventType.receivedByExtension,
          },
        ])

        expect(callbackSpy).toHaveBeenCalledWith(
          messageLifeCycleEventType.receivedByExtension
        )
      }, 1)
    })
  })
})
