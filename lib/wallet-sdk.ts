import { MessageClient } from './messages/message-client'
import { createSendMessage } from './messages/observables/send-message'
import { createMethods } from './create-methods'
import { AppLogger } from './helpers/logger'
import { Subjects } from './messages/subjects'

type WalletSdkInput = {
  networkId?: number
  dAppDefinitionAddress: string
  logger?: AppLogger
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
  logger,
}: WalletSdkInput) => {
  logger?.debug(`🔵 walletSdkInstantiated`)
  const messageClient = MessageClient(Subjects(), logger)

  const destroy = () => {
    logger?.debug(`🔵🧹 destroyingWalletSdkInstance`)
    messageClient.destroy()
  }

  const methods = createMethods(
    { networkId, dAppDefinitionAddress },
    createSendMessage(messageClient.subjects, logger),
    logger
  )

  return {
    ...methods,
    destroy,
    __subjects: messageClient.subjects,
  }
}

export { ManifestBuilder } from './manifest-builder'
export * from './manifest-value'
export { requestBuilder } from './request-builder'
export * from './IO/request-items'
export * from './IO/schemas'
export * from './helpers/error'
export * from './helpers/logger'
