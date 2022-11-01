import loglevel from 'loglevel'
import WalletSdk from '../lib/wallet-sdk'
import { Buffer } from 'buffer'
import { Result } from 'neverthrow'

const sdk = WalletSdk({ dAppId: 'radixDashboard' })
loglevel.setLevel('debug')

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
  // this is for example purposes. The challenge should be generated and stored on the backend to prevent replay attacks
  const challenge = Buffer.from(
    crypto.getRandomValues(new Uint8Array(32))
  ).toString('hex')

  displayResults(
    await sdk.request({
      login: {
        challenge,
      },
    })
  )
}

document.getElementById('account-address-btn')!.onclick = async () => {
  clearResults()
  displayResults(
    await sdk.request({
      accountAddresses: {
        numberOfAddresses: 1,
      },
    })
  )
}
