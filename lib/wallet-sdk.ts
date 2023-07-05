import { createMethods } from './create-methods'
import { AppLogger } from './helpers/logger'
import { Metadata as MetadataV2 } from './IO/v2/schemas'
import { ConnectorExtensionClient } from './connector-extension/connector-extension-client'

export type WalletSdkInput = MetadataV2 &
  Partial<{
    logger: AppLogger
    providers: Partial<{ connectorExtensionClient: ConnectorExtensionClient }>
  }>
export type WalletSdk = ReturnType<typeof WalletSdk>

export const WalletSdk = (input: WalletSdkInput) => {
  MetadataV2.parse({
    version: input.version,
    dAppDefinitionAddress: input.dAppDefinitionAddress,
    networkId: input.networkId,
  })

  input.logger?.debug(`🔵 walletSdkInstantiated`, {
    version: input.version,
    networkId: input.networkId,
    dAppDefinitionAddress: input.dAppDefinitionAddress,
  })

  const logger = input.logger
  const messageClient =
    input.providers?.connectorExtensionClient ??
    ConnectorExtensionClient({ logger })

  return {
    ...createMethods(input, messageClient),
    destroy: () => {
      logger?.debug(`🔵🧹 walletSdkInstantiatedDestroyed`)
      messageClient.destroy()
    },
  }
}

export { ManifestBuilder } from './manifest-builder'
export * as ManifestValue from './manifest-value'
export * from './IO/v1/schemas'
export * from './helpers/error'
export * from './helpers/logger'
