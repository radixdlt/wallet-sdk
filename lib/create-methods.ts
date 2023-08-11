import { AppLogger } from './wallet-sdk'
import {
  CallbackFns,
  Metadata,
  SendTransactionItem,
  WalletRequestItems,
  WalletRequestResponseItems,
  WalletTransactionResponseItems,
} from './IO'
import { ConnectorExtensionClient } from './connector-extension/connector-extension-client'
import { validateWalletResponse } from './helpers/validate-wallet-response'
import { walletInteractionFactory } from './IO/wallet-interaction-factory'

export type CreateMethodsInput = Metadata & Partial<{ logger: AppLogger }>
export type CreateMethods = ReturnType<typeof createMethods>
export const createMethods = (
  input: CreateMethodsInput,
  connectorExtensionClient: ConnectorExtensionClient
) => {
  const logger = input.logger
  const createWalletInteraction = walletInteractionFactory(logger)

  const request = (
    items: WalletRequestItems,
    callbackFns: Partial<CallbackFns> = {}
  ) =>
    createWalletInteraction(input, items)
      .andThen((walletInteraction) =>
        connectorExtensionClient.send(walletInteraction, callbackFns)
      )
      .andThen(validateWalletResponse)
      .map((response) => response.items as WalletRequestResponseItems)

  const sendTransaction = (
    items: SendTransactionItem,
    callbackFns: Partial<CallbackFns> = {}
  ) =>
    createWalletInteraction(input, {
      discriminator: 'transaction',
      send: items,
    })
      .andThen((walletInteraction) =>
        connectorExtensionClient.send(walletInteraction, callbackFns)
      )
      .andThen(validateWalletResponse)
      .map(
        (response): WalletTransactionResponseItems['send'] =>
          (response as any).items.send
      )

  return {
    request,
    sendTransaction,
    extensionStatus$: connectorExtensionClient.extensionStatus$,
    openPopup: connectorExtensionClient.openPopup,
  }
}
