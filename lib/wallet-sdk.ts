import { createMethods } from './create-methods'
import { AppLogger } from './helpers/logger'
import { Metadata } from './IO'
import { ConnectorExtensionClient } from './connector-extension/connector-extension-client'

export type WalletSdkInput = Omit<Metadata, 'version'> &
  Partial<{
    logger: AppLogger
    providers: Partial<{
      connectorExtensionClient: ConnectorExtensionClient
    }>
  }>
export type WalletSdk = ReturnType<typeof WalletSdk>

export const WalletSdk = (input: WalletSdkInput) => {
  const metadata = {
    version: 2,
    dAppDefinitionAddress: input.dAppDefinitionAddress,
    networkId: input.networkId,
  }

  Metadata.parse(metadata)

  input.logger?.debug(`🔵 walletSdkInstantiated`, metadata)

  const logger = input.logger
  const messageClient =
    input.providers?.connectorExtensionClient ??
    ConnectorExtensionClient({ logger })

  return {
    ...createMethods(
      {
        version: 2,
        logger: input.logger,
        dAppDefinitionAddress: input.dAppDefinitionAddress,
        networkId: input.networkId,
      },
      messageClient
    ),
    destroy: () => {
      logger?.debug(`🔵🧹 walletSdkInstantiatedDestroyed`)
      messageClient.destroy()
    },
  }
}

export * from './IO'
export * from './helpers/error'
export * from './helpers/logger'
