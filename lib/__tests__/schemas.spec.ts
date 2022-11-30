import {
  OneTimeAccountsResponseItemSchema,
  WalletSuccessResponseSchema,
} from '../IO/schemas'

describe('schemas', () => {
  it('OneTimeAccountsResponseItemSchema', () => {
    OneTimeAccountsResponseItemSchema.parse({
      requestType: 'oneTimeAccountsRead',
      accounts: [
        {
          address: 'rdx61333732663539372d383861352d3461',
          label: 'address-0',
          appearanceId: 0,
        },
        {
          address: 'rdx34316364646264632d616434662d3463',
          label: 'address-1',
          appearanceId: 1,
        },
        {
          address: 'rdx34313261646463652d363539392d3462',
          label: 'address-2',
          appearanceId: 2,
        },
      ],
    })
  })

  it('WalletSuccessResponseSchema', () => {
    WalletSuccessResponseSchema.parse({
      items: [
        {
          requestType: 'oneTimeAccountsRead',
          accounts: [
            {
              address: 'rdx61333732663539372d383861352d3461',
              label: 'address-0',
              appearanceId: 0,
            },
            {
              address: 'rdx34316364646264632d616434662d3463',
              label: 'address-1',
              appearanceId: 1,
            },
            {
              address: 'rdx34313261646463652d363539392d3462',
              label: 'address-2',
              appearanceId: 2,
            },
          ],
        },
      ],
      requestId: 'a6088a7d-f343-41a4-bf2579a7d5bf2afb',
    })
  })
})
