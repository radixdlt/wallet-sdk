[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

TypeScript developer SDK to communicate with the Radix Wallet.

- [Installation](#installation)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [Get Wallet Data](#get-wallet-data)
    - [Wallet support](#wallet-support)
    - [OneTime VS Ongoing requests](#onetime-vs-ongoing-requests)
    - [Get list of Accounts](#get-list-of-accounts)
      - [oneTimeAccountsWithoutProofOfOwnership](#onetimeaccountswithoutproofofownership)
      - [oneTimeAccountsWithProofOfOwnership](#onetimeaccountswithproofofownership)
      - [ongoingAccountsWithoutProofOfOwnership](#ongoingaccountswithoutproofofownership)
      - [ongoingAccountsWithProofOfOwnership](#ongoingaccountswithproofofownership)
    - [Get list of Persona data](#get-list-of-persona-data)
      - [oneTimePersonaData](#onetimepersonadata)
      - [ongoingPersonaData](#ongoingpersonadata)
    - [Login](#login)
      - [loginWithChallenge](#loginwithchallenge)
      - [loginWithoutChallenge](#loginwithoutchallenge)
      - [usePersona](#usepersona)
  - [Send transaction](#send-transaction)
    - [Build manifest](#build-manifest)
    - [sendTransaction](#sendtransaction)
  - [Errors](#errors)

# Installation

**Using NPM**

```bash
npm install @radixdlt/wallet-sdk
```

**Using Yarn**

```bash
yarn add @radixdlt/wallet-sdk
```

# Usage

## Getting started

```typescript
import WalletSdk from '@radixdlt/wallet-sdk'

const walletSdk = WalletSdk({ dAppId: 'instabridge', networkId: 0x01 })
```

```typescript
type WalletSdkInput = {
  dAppId: string
  networkId?: number
  logLevel?: LogLevelDesc
}
```

- **requires** dAppId - Specifies the dApp that is interacting with the wallet. Used in dApp verification process on the wallet side.
- **optional** networkId - Specifies which network to use, defaults to mainnet (0x01)
- **optional** logLevel - Specifies level of log output. Used internally for debugging.

## Get Wallet Data

### Wallet support

| Requests                                                                          | Wallet support |
| :-------------------------------------------------------------------------------- | :------------: |
| [oneTimeAccountsWithoutProofOfOwnership](#onetimeaccountswithoutproofofownership) |       ✅       |
| [oneTimeAccountsWithProofOfOwnership](#onetimeaccountswithproofofownership)       |       ❌       |
| [ongoingAccountsWithoutProofOfOwnership](#ongoingaccountswithoutproofofownership) |       ❌       |
| [ongoingAccountsWithProofOfOwnership](#ongoingaccountswithproofofownership)       |       ❌       |
| [oneTimePersonaData](#onetimepersonadata)                                         |       ❌       |
| [ongoingPersonaData](#ongoingpersonadata)                                         |       ❌       |
| [loginWithChallenge](#loginwithchallenge)                                         |       ❌       |
| [loginWithoutChallenge](#loginwithoutchallenge)                                   |       ❌       |
| [usePersona](#usepersona)                                                         |       ❌       |

### OneTime VS Ongoing requests

There are two types of data requests: `oneTime` and `ongoing`. One time data requests will always ask for the user's permission to share data with the dApp. Conversely ongoing data requests will ask for permission **once**, the wallet will then store the permission. Future data requests will automatically be sent back the dApp. The data that the user shares with dApps can be managed from the wallet and revoked at any time.

In order to request `ongoing` data a `login` request needs to be made. The login response will contain a `personaId` which future requests need to provide.

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.login.withoutChallenge(),
    requestItem.ongoingAccounts.withoutProofOfOwnership()
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   login: {
//     personaId: string
//   },
//   ongoingAccounts: Account[]
// }
const value = result.value

// store the personaId for future ongoing data requests
const personaId = value.login.personaId
```

Notice that `requestItem.usePersona(personaId)` needs to contain the stored personaId.

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.usePersona(personaId),
    requestItem.ongoingAccounts.withoutProofOfOwnership()
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     id: string
//   },
//   ongoingAccounts: Account[]
// }
const value = result.value
```

### Get list of Accounts

**Types**

```typescript
type Account = {
  address: string
  label: string
  appearanceId: number
}
```

```typescript
type AccountWithProofOfOwnership = {
  account: {
    address: string
    label: string
    appearanceId: number
  }
  challenge: string
  signature: string
}
```

#### oneTimeAccountsWithoutProofOfOwnership

Get a list of accounts

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.oneTimeAccounts.withoutProofOfOwnership(3))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   oneTimeAccounts: Account[];
// }
const value = result.value
```

#### oneTimeAccountsWithProofOfOwnership

Get a list of accounts with verifiable cryptographic proof of ownership.

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.oneTimeAccounts.withProofOfOwnership(3))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   oneTimeAccounts: AccountWithProofOfOwnership[];
// }
const value = result.value
```

#### ongoingAccountsWithoutProofOfOwnership

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.usePersona(personaId),
    requestItem.ongoingAccounts.withoutProofOfOwnership(3)
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   ongoingAccounts: Account[];
// }
const value = result.value
```

#### ongoingAccountsWithProofOfOwnership

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.usePersona(personaId),
    requestItem.ongoingAccounts.withProofOfOwnership(3)
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   ongoingAccounts: AccountWithProofOfOwnership[];
// }
const value = result.value
```

### Get list of Persona data

Get a list of data fields such as `firstName`, `email`, `shippingAddress`, etc.

**Types**

```typescript
type PersonaDataField = {
  value: string
  field: string
}
```

#### oneTimePersonaData

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.oneTimePersonaData(['firstName', 'email']))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   oneTimePersonaData: PersonaDataField[];
// }
const value = result.value
```

#### ongoingPersonaData

```typescript
const result = await walletSdk.request(
  requestItem.usePersona(personaId),
  requestBuilder(requestItem.ongoingPersonaData(['firstName', 'email']))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     id: string
//   }
//   ongoingPersonaData: PersonaDataField[];
// }
const value = result.value
```

### Login

#### loginWithChallenge

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.login.withChallenge('e23e7a3e-c349-4ca7-8ce1-1d067b396cb2')
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   login: {
//     personaId: string
//     challenge: string
//     publicKey: string
//     signature: string
//     identityComponentAddress: string
//   }
// }
const value = result.value
```

#### loginWithoutChallenge

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.login.withoutChallenge())
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   login: {
//     personaId: string
//   }
// }
const value = result.value
```

#### usePersona

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.usePersona(personaId))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     id: string
//   }
// }
const value = result.value
```

## Send transaction

Submit a signed transaction to the radix network

### Build manifest

```typescript
import {
  ManifestBuilder,
  Decimal,
  ResourceAddress,
  Bucket,
  Expression,
} from '@radixdlt/wallet-sdk'

const manifest = new ManifestBuilder()
  .callMethod(
    'component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl',
    'withdraw_by_amount',
    [
      Decimal('1'),
      ResourceAddress(
        'resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9'
      ),
    ]
  )
  .takeFromWorktop(
    'resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9',
    'xrd_bucket'
  )
  .callMethod(
    'component_tdx_a_1qfdcf5nvl9qkfv743p7dzj7zse5ex50p3cqnelg6puuqd4m540',
    'buy_gumball',
    [Bucket('xrd_bucket')]
  )
  .callMethod(
    'component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl',
    'deposit_batch',
    [Expression('ENTIRE_WORKTOP')]
  )
  .build()
  .toString()
```

More example can be found [here](./lib/__tests__/manifest-builder.spec.ts).

### sendTransaction

```typescript
type SendTransactionInput = {
  transactionManifest: string
  version: number
  blobs?: string[]
  message?: string
}
```

- **requires** transactionManifest - specify the transaction manifest
- **requires** version - specify the version of the transaction manifest
- **optional** blobs - used for deploying packages
- **optional** message - message to be included in the transaction

```typescript
const result = await walletSdk.sendTransaction({
  transactionManifest: manifest,
  version: 1,
})

if (result.isErr()) {
  // code to handle the exception
}

// {
//   transactionIntentHash: string
// }
const value = result.value
```

## Errors

| Error type                                       | Description                                                                                                                                                        | Message                                                                                                                                     |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| rejectedByUser                                   | User has rejected the request in the wallet                                                                                                                        |                                                                                                                                             |
| missingExtension                                 | Connector extension is not detected                                                                                                                                |                                                                                                                                             |
| walletRequestValidation                          | SDK has constructed an invalid request                                                                                                                             |                                                                                                                                             |
| walletResponseValidation                         | Wallet sent an invalid response                                                                                                                                    |                                                                                                                                             |
| wrongNetwork                                     | Wallet is currently using a network with a network ID that does not match the one specified in request from Dapp (inside metadata)                                 | "Wallet is using network ID: \(currentNetworkID), request sent specified network ID: \(requestFromP2P.requestFromDapp.metadata.networkId)." |
| failedToPrepareTransaction                       | Failed to get Epoch for Transaction Header                                                                                                                         |                                                                                                                                             |
| failedToCompileTransaction                       | Failed to compile TransactionIntent or any other later form to SBOR using EngineToolkit                                                                            |                                                                                                                                             |
| failedToSignTransaction                          | Failed to sign any form of the transaction either with keys for accounts or with notary key, or failed to convert the signature to by EngineToolkit require format |                                                                                                                                             |
| failedToSubmitTransaction                        | App failed to submit the transaction to Gateway for some reason                                                                                                    |                                                                                                                                             |
| failedToPollSubmittedTransaction                 | App managed to submit transaction but got error while polling it                                                                                                   | "TXID: <TXID_STRING>"                                                                                                                       |
| submittedTransactionWasDuplicate                 | App submitted a transaction and got informed by Gateway it was duplicated                                                                                          | "TXID: <TXID_STRING>"                                                                                                                       |
| submittedTransactionHasFailedTransactionStatus   | App submitted a transaction to Gateway and polled transaction status telling app it was a failed transaction                                                       | "TXID: <TXID_STRING>"                                                                                                                       |
| submittedTransactionHasRejectedTransactionStatus | App submitted a transaction to Gateway and polled transaction status telling app it was a rejected transaction                                                     | "TXID: <TXID_STRING>"                                                                                                                       |
