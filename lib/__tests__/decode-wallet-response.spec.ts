import { decodeWalletResponse } from '../IO/decode-wallet-response'
import { requestType, Wallet } from '../_types'

describe('decodeWalletResponse', () => {
  it('should output correct value', () => {
    const walletResponse: Wallet['response'] = [
      { requestType: requestType.login, personaId: 'abc' },
      {
        requestType: requestType.oneTimeAccountAddresses,
        accountAddresses: [
          { label: 'main account', address: 'abc', appearanceId: 0 },
        ],
        proofOfOwnership: false,
      },
      {
        requestType: requestType.ongoingAccountAddresses,
        accountAddresses: [
          { label: 'main account', address: 'abc', appearanceId: 1 },
        ],
        proofOfOwnership: false,
      },
      {
        requestType: requestType.oneTimePersonaData,
        personaData: [{ field: 'email', value: 'abc' }],
      },
      {
        requestType: requestType.ongoingPersonaData,
        personaData: [{ field: 'email', value: 'abc' }],
      },
      {
        requestType: requestType.sendTransaction,
        transactionIntentHash: 'abc',
      },
    ]
    expect(decodeWalletResponse(walletResponse)).toEqual({
      login: { personaId: 'abc' },
      oneTimeAccountAddresses: [
        { label: 'main account', address: 'abc', appearanceId: 0 },
      ],
      ongoingAccountAddresses: [
        { label: 'main account', address: 'abc', appearanceId: 1 },
      ],
      oneTimePersonaData: [{ field: 'email', value: 'abc' }],
      ongoingPersonaData: [{ field: 'email', value: 'abc' }],
      transactionIntentHash: 'abc',
    })
  })
})
