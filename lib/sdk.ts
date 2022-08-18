import { MessageClient } from './messages/message-client'
import { request } from './methods'
import log from 'loglevel'

export type RadixSdkType = ReturnType<typeof RadixSdk>

export const RadixSdk = () => {
  log.debug(`🔵 radix sdk instantiated`)
  const messageClient = MessageClient()

  const destroy = () => {
    log.debug(`🧹 destroying sdk instance`)
    messageClient.destroy()
  }

  return {
    destroy,
    request: request(messageClient.subjects),
    __subjects: messageClient.subjects,
  }
}
