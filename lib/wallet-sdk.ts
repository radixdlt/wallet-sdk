import { MessageClient } from './messages/message-client'
import log, { LogLevelDesc } from 'loglevel'
import { createSendMessage } from './messages/observables/send-message'
import { createMethods } from './create-methods'
import { config } from './config'

type WalletSdkInput = {
  networkId?: number
  dAppDefinitionAddress: string
  logLevel?: LogLevelDesc
}

export const Network = {
  Mainnet: 0x01,
  Stokenet: 0x02,
  Adapanet: 0x0a,
  Nebunet: 0x0b,
  Gilganet: 0x20,
  Enkinet: 0x21,
  Hammunet: 0x22,
} as const

export type WalletSdk = ReturnType<typeof WalletSdk>

export const WalletSdk = ({
  networkId = Network.Mainnet,
  dAppDefinitionAddress,
  logLevel = config.logLevel,
}: WalletSdkInput) => {
  log.setLevel(logLevel)
  log.debug(`🔵 wallet sdk instantiated`)
  const messageClient = MessageClient()

  const destroy = () => {
    log.debug(`🔵🧹 destroying wallet sdk instance`)
    messageClient.destroy()
  }

  const methods = createMethods(
    { networkId, dAppDefinitionAddress },
    createSendMessage(messageClient.subjects)
  )

  return {
    ...methods,
    destroy,
    __subjects: messageClient.subjects,
  }
}

export { ManifestBuilder } from './manifest-builder'
export * from './scrypto-value'
export { requestBuilder } from './request-builder'
export * from './IO/request-items'
export * from './IO/schemas'
export * from './helpers/error'
