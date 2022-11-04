export type SendTransaction = {
  requestType: 'sendTransaction'
  wallet: {
    request: {
      requestType: 'sendTransaction'
      transactionManifest: string
      version: number
      accountAddress: string
      blobs?: string[]
      message?: string
    }
    response: {
      requestType: 'sendTransaction'
      transactionIntentHash: string
    }
  }
  method: {
    input: {
      transactionManifest: string
      version: number
      accountAddress: string
      blobs?: string[]
      message?: string
    }
    output: { transactionIntentHash: string }
  }
}
