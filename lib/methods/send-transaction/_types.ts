export type TransactionManifest = string

export type SendTransaction = TransactionManifest

export type TransactionHash = string

export type TransactionWalletResponse = TransactionHash

export type SendTransactionMethodInput = {
  transactionManifest: string
  version: number
  accountAddress: string
  blobs?: string[]
  message?: string
}
