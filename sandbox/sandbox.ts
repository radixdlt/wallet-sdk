import loglevel from 'loglevel'
import WalletSdk from '../lib/wallet-sdk'

const sdk = WalletSdk()
loglevel.setLevel('debug')

const accountAddressElement = document.getElementById('accountAddress')!
const emailElement = document.getElementById('email')!
const fetchAccountAddressButtonElement = document.getElementById(
  'fetchAccountAddress'
)!

fetchAccountAddressButtonElement.onclick = async () => {
  const result = await sdk.request({
    accountAddresses: {},
    personaData: { fields: ['firstName', 'email'] },
  })

  if (result.isErr()) {
    throw result.error
  }

  const { accountAddresses, personaData } = result.value

  if (accountAddresses)
    accountAddressElement!.innerText = accountAddresses[0].address

  if (personaData) emailElement.innerText = personaData[0].value
}
