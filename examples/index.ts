import { WalletSdk } from '../lib/wallet-sdk'
import { Result } from 'neverthrow'
import { createLogger } from '../lib/helpers/logger'

const sdk = WalletSdk({
  dAppDefinitionAddress:
    'account_tdx_d_12y9wptk69gxnfqrm4gepcu4apuscc8z4v5pvurfr3tcmtjl29a2wjn',
  logger: createLogger(1),
  networkId: 13,
})

document.getElementById('open-popup-btn')!.onclick = async () => {
  sdk.openPopup()
}

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

document.getElementById('login-btn')!.onclick = async () => {
  clearResults()
  const result = await sdk.request({
    discriminator: 'authorizedRequest',
    auth: { discriminator: 'loginWithoutChallenge' },
    ongoingPersonaData: {
      isRequestingName: true,
      numberOfRequestedEmailAddresses: { quantifier: 'atLeast', quantity: 1 },
      numberOfRequestedPhoneNumbers: { quantifier: 'exactly', quantity: 1 },
    },
  })
  if (result.isErr()) return
  result.value.discriminator === 'authorizedRequest' &&
    result.value.ongoingPersonaData?.name!.given!

  displayResults(result)
}

document.getElementById('account-address-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.request(
    {
      discriminator: 'unauthorizedRequest',
      oneTimeAccounts: {
        numberOfAccounts: { quantifier: 'atLeast', quantity: 1 },
      },
    },
    {
      eventCallback: (event) => console.log(event),
      requestControl: ({ getRequest }) => {
        console.log(getRequest().interactionId)
      },
    }
  )

  displayResults(result)
}

document.getElementById('persona-data-btn')!.onclick = async () => {
  clearResults()

  const result = await sdk.request({
    discriminator: 'unauthorizedRequest',
    oneTimePersonaData: { isRequestingName: true },
  })

  displayResults(result)
}
