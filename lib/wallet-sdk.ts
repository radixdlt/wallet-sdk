import { createMethods } from './create-methods'
import { AppLogger } from './helpers/logger'
import { ConnectorExtensionClient } from './connector-extension/connector-extension-client'
import { Metadata } from '@radixdlt/radix-connect-schemas'

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
    removeSessionId: messageClient.removeSessionId,
    destroy: () => {
      logger?.debug(`🔵🧹 walletSdkInstantiatedDestroyed`)
      messageClient.destroy()
    },
  }
}

export * from './IO'
export * from './helpers/error'
export * from './helpers/logger'
export * from '@radixdlt/radix-connect-schemas'
