import { SendTransactionResponseItem, SendTransactionItem } from '../schemas'

export type SendTransaction = {
  wallet: {
    request: SendTransactionItem
    response: SendTransactionResponseItem
  }
  method: {
    input: {
      transactionManifest: string
      version: number
      blobs?: string[]
      message?: string
    }
    output: { transactionIntentHash: string }
  }
}
