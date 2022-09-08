export const eventType = {
  outgoingMessage: 'radix#chromeExtension#send',
  incomingMessage: 'radix#chromeExtension#receive',
} as const

export type OutgoingMessageEvent = typeof eventType['outgoingMessage']
export type IncomingMessageEvent = typeof eventType['incomingMessage']

export const messageLifeCycleEvent = {
  receivedByExtension: 'receivedByExtension',
} as const

export type MessageLifeCycleEvent = keyof typeof messageLifeCycleEvent
