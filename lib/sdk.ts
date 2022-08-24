import { MessageClient } from './messages/message-client'
import { request, sendTransaction } from './methods'
import log from 'loglevel'

export type RadixSdkType = ReturnType<typeof RadixSdk>

export const RadixSdk = () => {
  log.debug(`🔵 radix sdk instantiated`)
  const messageClient = MessageClient()

  const destroy = () => {
    log.debug(`🧹 destroying sdk instance`)
    messageClient.destroy()
  }

  const methods = {
    request: request(messageClient.subjects),
    sendTransaction: sendTransaction(messageClient.subjects),
  }

  return {
    ...methods,
    destroy,
    __subjects: messageClient.subjects,
  }
}
