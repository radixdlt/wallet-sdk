import { decodeWalletResponse } from '../IO/decode-wallet-response'
import { RequestTypeSchema, WalletSuccessResponse } from '../IO/schemas'

describe('decodeWalletResponse', () => {
  it('should output correct value', () => {
    const walletResponse: WalletSuccessResponse['items'] = [
      { requestType: RequestTypeSchema.loginRead.value, personaId: 'abc' },
      {
        requestType: RequestTypeSchema.oneTimeAccountsRead.value,
        accounts: [{ label: 'main account', address: 'abc', appearanceId: 0 }],
      },
      {
        requestType: RequestTypeSchema.ongoingAccountsRead.value,
        accounts: [{ label: 'main account', address: 'abc', appearanceId: 1 }],
      },
      {
        requestType: RequestTypeSchema.oneTimePersonaDataRead.value,
        fields: [{ field: 'email', value: 'abc' }],
      },
      {
        requestType: RequestTypeSchema.ongoingPersonaDataRead.value,
        fields: [{ field: 'email', value: 'abc' }],
      },
      {
        requestType: RequestTypeSchema.sendTransactionWrite.value,
        transactionIntentHash: 'abc',
      },
    ]
    expect(decodeWalletResponse(walletResponse)).toEqual({
      login: { personaId: 'abc' },
      oneTimeAccounts: [
        { label: 'main account', address: 'abc', appearanceId: 0 },
      ],
      ongoingAccounts: [
        { label: 'main account', address: 'abc', appearanceId: 1 },
      ],
      oneTimePersonaData: [{ field: 'email', value: 'abc' }],
      ongoingPersonaData: [{ field: 'email', value: 'abc' }],
      transactionIntentHash: 'abc',
    })
  })
})
