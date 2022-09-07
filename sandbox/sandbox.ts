import loglevel from 'loglevel'
import { RadixSdk } from '../lib/sdk'
import { Buffer } from 'buffer'
import { DefaultApi } from './api'

const sdk = RadixSdk()
const api = new DefaultApi()

loglevel.setLevel('debug')

// Global states
let accountAddress: string // User account address
let packageHex: string // GumballMachine package address
let packageAddress: string // GumballMachine package address
let componentAddress: string // GumballMachine component address
let resourceAddress: string // GUM resource address

document.getElementById('fetchAccountAddress').onclick = async function () {
  // Retrieve extension user account address
  const result = await sdk.request({
    accountAddresses: {},
  })

  if (result.isErr()) {
    throw result.error
  }

  const { accountAddresses } = result.value

  if (!accountAddresses) return

  document.getElementById('accountAddress').innerText =
    accountAddresses[0].address
  accountAddress = accountAddresses[0].address
}

document.getElementById('packageFileInput').onchange = async (
  ev: InputEvent
) => {
  let reader = new FileReader()
  reader.onload = () => {
    let arrayBuffer = reader.result
    if (arrayBuffer && typeof arrayBuffer !== 'string') {
      packageHex = Buffer.from(arrayBuffer).toString('hex')
    }
  }
  reader.readAsArrayBuffer(ev.target.files[0])
}

document.getElementById('publishPackage').onclick = async function () {
  if (!packageHex) return
  // Construct manifest
  const result = await sdk.sendTransaction(
    `CALL_METHOD ComponentAddress("${accountAddress}") "lock_fee" Decimal("100");
PUBLISH_PACKAGE Bytes("${packageHex}");`
  )

  if (result.isErr()) throw result.error

  const { transactionHash } = result.value

  const receipt = await api.getReceipt({
    hash: transactionHash,
  })

  // Update UI
  packageAddress = receipt.newPackages[0]
  document.getElementById('packageAddress').innerText = packageAddress
}

document.getElementById('instantiateComponent').onclick = async function () {
  if (!packageAddress) return

  // Send manifest to extension for signing
  const result = await sdk.sendTransaction(
    `CALL_FUNCTION PackageAddress("${packageAddress}") "GumballMachine" "instantiate_gumball_machine" Decimal("1.0");`
  )

  if (result.isErr()) throw result.error

  const { transactionHash } = result.value

  const receipt = await api.getReceipt({
    hash: transactionHash,
  })

  if (receipt.status === 'Success') {
    componentAddress = receipt.newComponents[0]
    resourceAddress = receipt.newResources[0]
    document.getElementById('componentAddress').innerText = componentAddress
  } else {
    document.getElementById('componentAddress').innerText =
      'Error: ' + receipt.status
  }
}

document.getElementById('buyGumball').onclick = async function () {
  // Construct manifest
  const manifest = `CALL_METHOD ComponentAddress("${accountAddress}") "withdraw_by_amount" Decimal("1") ResourceAddress("030000000000000000000000000000000000000000000000000004");
TAKE_FROM_WORKTOP ResourceAddress("030000000000000000000000000000000000000000000000000004") Bucket("xrd");
CALL_METHOD ComponentAddress("${componentAddress}") "buy_gumball" Bucket("xrd");
CALL_METHOD_WITH_ALL_RESOURCES ComponentAddress("${accountAddress}") "deposit_batch";`

  const result = await sdk.sendTransaction(manifest)

  if (result.isErr()) throw result.error

  // Send manifest to extension for signing
  const { transactionHash } = result.value

  const receipt = await api.getReceipt({
    hash: transactionHash,
  })

  // Update UI
  document.getElementById('receipt').innerText = JSON.stringify(
    receipt,
    null,
    2
  )
}

document.getElementById('checkBalance').onclick = async function () {
  // Retrieve component info from PTE service

  const userComponent = await api.getComponent({
    address: accountAddress,
  })
  const machineComponent = await api.getComponent({
    address: componentAddress,
  })

  // Update UI
  document.getElementById('userBalance').innerText =
    userComponent.ownedResources
      .filter((e) => e.resourceAddress === resourceAddress)
      .map((e) => e.amount)[0] || '0'
  document.getElementById('machineBalance').innerText =
    machineComponent.ownedResources
      .filter((e) => e.resourceAddress === resourceAddress)
      .map((e) => e.amount)[0]
}
