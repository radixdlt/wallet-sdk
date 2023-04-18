import { WalletSdk, requestBuilder, requestItem } from '../lib/wallet-sdk'
import { Result } from 'neverthrow'
import { login } from '../lib/IO/request-items/login'
import { reset } from '../lib/IO/request-items/reset'
import { createLogger } from '../lib/helpers/logger'

const sdk = WalletSdk({
  dAppDefinitionAddress:
    'account_tdx_a_1qd5svul20u30qnq408zhj2tw5evqrunq48eg0jsjf9qsx5t8qu',
  logger: createLogger(1),
})

const transactionManifest = `
# Withdraw XRD from account
CALL_METHOD Address("account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn") "withdraw" Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Decimal("5.0");

# Buy GUM with XRD
TAKE_FROM_WORKTOP_BY_AMOUNT Decimal("2.0") Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("xrd");
CALL_METHOD Address("component_sim1qd8djmepmq7hxqaakt9rl3hkce532px42s8eh4qmqlks9f87dn") "buy_gumball" Bucket("xrd");
ASSERT_WORKTOP_CONTAINS_BY_AMOUNT Decimal("3.0") Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k");
ASSERT_WORKTOP_CONTAINS Address("resource_sim1q2ym536cwvvf3cy9p777t4qjczqwf79hagp3wn93srvsgvqtwe");

# Create a proof from bucket, clone it and drop both
TAKE_FROM_WORKTOP Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("some_xrd");

# Return a bucket to worktop
RETURN_TO_WORKTOP Bucket("some_xrd");
TAKE_FROM_WORKTOP_BY_IDS Array<NonFungibleLocalId>(NonFungibleLocalId("#1#")) Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k") Bucket("nfts");

# Move all resources in worktop to account
CALL_METHOD Address("account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn") "deposit_batch" Expression("ENTIRE_WORKTOP");
`

const displayResults = (result: Result<any, any>) => {
  document.getElementById('results')!.innerHTML = `<pre>${JSON.stringify(
    result.isErr() ? result.error : result.value,
    null,
    2
  )}</pre>`
}

const clearResults = () => {
  document.getElementById('results')!.innerHTML = ``
}
const accountAddressInputElement = document.getElementById(
  'account-address-input'
)! as HTMLInputElement

document.getElementById('login-btn')!.onclick = async () => {
  clearResults()
  const result = await sdk.request({
    loginWithoutChallenge: {},
    reset: { accounts: true },
  })

  displayResults(result)
}

document.getElementById('account-address-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.request(
    requestBuilder(
      requestItem.oneTimeAccounts.withoutProofOfOwnership(
        accountAddressInputElement.value
          ? parseInt(accountAddressInputElement.value, 10)
          : undefined
      )
    )
  )

  displayResults(result)
}

document.getElementById('persona-data-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.request(
    requestBuilder(login.withoutChallenge(), reset({ personaData: true }))
  )

  displayResults(result)
}

document.getElementById('persona-accounts-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.request(
    requestBuilder(
      requestItem.oneTimePersonaData('givenName'),
      requestItem.oneTimeAccounts.withoutProofOfOwnership(5)
    )
  )

  displayResults(result)
}

document.getElementById('send-tx-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.sendTransaction({
    transactionManifest,
    version: 1,
  })

  displayResults(result)
}

window.radixWalletSdk = sdk

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    radixWalletSdk: typeof sdk
  }
}
