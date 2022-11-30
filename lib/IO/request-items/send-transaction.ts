import {
  SendTransactionResponseItem,
  SendTransactionWriteRequestItem,
} from '../schemas'

export type SendTransaction = {
  wallet: {
    request: SendTransactionWriteRequestItem
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
