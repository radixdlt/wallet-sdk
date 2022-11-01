import { MessageClient } from './messages/message-client'
import { request, sendTransaction } from './methods'
import log from 'loglevel'
import { sendMessage as createSendMessage } from './messages/observables/send-message'

type WalletSdkInput = { networkId?: number; dAppId: string }

export const Network = {
  Mainnet: 0x01,
  Stokenet: 0x02,
  Adapanet: 0x0a,
  Nebunet: 0x0b,
  Gilganet: 0x20,
  Enkinet: 0x21,
  Hammunet: 0x22,
} as const

const WalletSdk = ({ networkId = Network.Mainnet, dAppId }: WalletSdkInput) => {
  log.debug(`🔵 wallet sdk instantiated`)
  const messageClient = MessageClient()

  const destroy = () => {
    log.debug(`🔵🧹 destroying wallet sdk instance`)
    messageClient.destroy()
  }

  const sendMessage = createSendMessage(
    { networkId, dAppId },
    messageClient.subjects
  )

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
