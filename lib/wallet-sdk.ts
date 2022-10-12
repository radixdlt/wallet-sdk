import { MessageClient } from './messages/message-client'
import { request, sendTransaction } from './methods'
import log from 'loglevel'
import { sendMessage as createSendMessage } from './messages/observables/send-message'

type WalletSdkInput = { networkId?: number }

export const Network = { mainnet: 0x01, betanet: 0x00, alphanet: 0x0a } as const

const defaultInput = { networkId: Network.mainnet }

const WalletSdk = ({
  networkId = Network.mainnet,
}: WalletSdkInput = defaultInput) => {
  log.debug(`🔵 wallet sdk instantiated`)
  const messageClient = MessageClient()

  const destroy = () => {
    log.debug(`🔵🧹 destroying wallet sdk instance`)
    messageClient.destroy()
  }

  const sendMessage = createSendMessage(networkId, messageClient.subjects)

  const methods = {
    request: request(sendMessage),
    sendTransaction: sendTransaction(sendMessage),
  }

  return {
    ...methods,
    destroy,
    __subjects: messageClient.subjects,
  }
}

export type WalletSdk = ReturnType<typeof WalletSdk>

export default WalletSdk

export { ManifestBuilder } from './manifest-builder'
