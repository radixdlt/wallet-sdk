[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This is a TypeScript developer SDK that facilitates communication with the Radix Wallet for two purposes: **requesting various forms of data from the wallet** and **sending transactions to the wallet**.

**Important Note:** This is an early release for development on the Radix Betanet and the Radix Wallet developer preview. This readme describes the intended full interface for the Radix mainnet release, but many features are not yet available (and are flagged as such).

The current version only supports desktop browser webapps with requests made via the Radix Wallet Connector browser extension. It is intended to later add support for mobile browser webapps using deep linking with the same essential interface.

You may wish to consider using this with the [√ Connect Button](https://github.com/radixdlt/connect-button), which works with this SDK to provide additional features for your application and users.

- [Installation](#installation)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [Get Wallet Data](#get-wallet-data)
    - [Wallet support](#wallet-support)
    - [About oneTime VS ongoing requests](#about-onetime-vs-ongoing-requests)
    - [Get list of Accounts](#get-list-of-accounts)
      - [oneTimeAccountsWithoutProofOfOwnership](#onetimeaccountswithoutproofofownership)
      - [oneTimeAccountsWithProofOfOwnership](#onetimeaccountswithproofofownership)
      - [ongoingAccountsWithoutProofOfOwnership](#ongoingaccountswithoutproofofownership)
      - [ongoingAccountsWithProofOfOwnership](#ongoingaccountswithproofofownership)
    - [Get list of Persona data](#get-list-of-persona-data)
      - [oneTimePersonaData](#onetimepersonadata)
      - [ongoingPersonaData](#ongoingpersonadata)
    - [Login](#login)
      - [login](#login-1)
      - [usePersona](#usepersona)
  - [Send transaction](#send-transaction)
    - [Build transaction manifest](#build-transaction-manifest)
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

| Requests                                                                          | Current Radix Wallet support |
| :-------------------------------------------------------------------------------- | :--------------------------: |
| [oneTimeAccountsWithoutProofOfOwnership](#onetimeaccountswithoutproofofownership) |              ✅              |
| [oneTimeAccountsWithProofOfOwnership](#onetimeaccountswithproofofownership)       |              ❌              |
| [ongoingAccountsWithoutProofOfOwnership](#ongoingaccountswithoutproofofownership) |              ❌              |
| [ongoingAccountsWithProofOfOwnership](#ongoingaccountswithproofofownership)       |              ❌              |
| [oneTimePersonaData](#onetimepersonadata)                                         |              ❌              |
| [ongoingPersonaData](#ongoingpersonadata)                                         |              ❌              |
| [loginWithChallenge](#loginwithchallenge)                                         |              ❌              |
| [loginWithoutChallenge](#loginwithoutchallenge)                                   |              ❌              |
| [usePersona](#usepersona)                                                         |              ❌              |

### About oneTime VS ongoing requests

There are two types of data requests: `oneTime` and `ongoing`.

OneTime data requests will always result in the Radix Wallet asking for the user's permission to share the data with the dApp.

Ongoing data requests will only result in the Radix Wallet asking for the user's permission the first time. If accepted, the Radix Wallet will automatically respond to future data requests of this type with the current data. The user's permissions for ongoing data sharing with a given dApp can be managed or revoked by the user at any time in the Radix Wallet.

The user's ongoing data sharing permissions are associated with a given Persona (similar to a login) in the Radix Wallet. This means that in order to request `ongoing` data, a `identityAddress` must be included.

Typically the dApp should begin with a `login` request which will return the `identityAddress` for the user's chosen Persona, which can be used for further requests (perhaps while the user has a valid session):

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.login('e23e7a3e-c349-4ca7-8ce1-1d067b396cb2'),
    requestItem.ongoingAccounts.withoutProofOfOwnership()
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   login: {
//     persona: {
//       label: string
//       identityAddress: string
//     }
//   },
//   ongoingAccounts: Account[]
// }
const value = result.value

// store the identityAddress for future ongoing data requests
const identityAddress = value.login.persona.identityAddress
```

Notice that `requestItem.usePersona(identityAddress)` needs to contain the stored `identityAddress`.

```typescript
const result = await walletSdk.request(
  requestBuilder(
    requestItem.usePersona(identityAddress),
    requestItem.ongoingAccounts.withoutProofOfOwnership()
  )
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     label: string
//     identityAddress: string
//   },
//   ongoingAccounts: Account[]
// }
const value = result.value
```

### Get list of Accounts

This request type is for one or more Radix account addresses managed by the user's Radix Wallet app. You may specify the number of accounts desired, and if you require proof of ownership of the account.

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
    requestItem.usePersona(identityAddress),
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
    requestItem.usePersona(identityAddress),
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

This request type is for a list of personal data fields such as `firstName`, `email`, `shippingAddress`, etc. associated with the user's selected Persona.

**NOTE:** A complete list of supported data fields will be provided later when this request type becomes supported.

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
  requestItem.usePersona(identityAddress),
  requestBuilder(requestItem.ongoingPersonaData(['firstName', 'email']))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     identityAddress: string
//     label: string
//   }
//   ongoingPersonaData: PersonaDataField[];
// }
const value = result.value
```

### Login

Sometimes your dApp may want a more personalized, consistent user experience and the Radix Wallet is able to login users with a Persona.

For a pure frontend dApp without any server backend, you may simply want to request such a login from the users's wallet so that the wallet keeps track of data sharing preferences for your dApp and they don't have to re-select that data each time they connect.

If your dApp does have a server backend and you are keeping track of users to personalize their experience, a Persona-based login provides strong proof of user identity, and the ID returned from the wallet provides a unique index for that user.

Once your dApp has a given `identityAddress`, it may be used for future requests for data that the user has given "ongoing" permission to share.

#### login

This request type results in the Radix Wallet asking the user to select a Persona to login to this dApp (or suggest one already used in the past there), and providing cryptographic proof of control.

This proof comes in the form of a signed "challenge" against an on-ledger Identity component. For each Persona a user creates in the Radix Wallet, the wallet automatically creates an associated on-ledger Identity (which contains none of the personal data held in the wallet). This Identity includes a public key in its metadata, and the signature on the challenge uses the corresponding private key. ROLA (Radix Off-Ledger Authentication) may be used in your dApp backend to check if the login challenge is correct against on-ledger state.

The on-ledger address of this Identity will be the `identityAddress` used to identify that user – in future queries, or perhaps in your dApp's own user database.

If you are building a pure frontend dApp where the login is for pure user convenience, you may safely ignore the challenge and simply keep track of the `identityAddress` in the user's session for use in data requests that require it.

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.login('e23e7a3e-c349-4ca7-8ce1-1d067b396cb2'))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   login: {
//     persona: {
//       label: string
//       identityAddress: string
//       publicKey: string
//     }
//     challenge: string
//     signature: string
//   }
// }
const value = result.value
```

#### usePersona

If you have already identified the user via a login (perhaps for a given active session), you may specify a `identityAddress` directly without requesting a login from the wallet.

```typescript
const result = await walletSdk.request(
  requestBuilder(requestItem.usePersona(identityAddress))
)

if (result.isErr()) {
  // code to handle the exception
}

// {
//   persona: {
//     identityAddress: string
//     label: string
//   }
// }
const value = result.value
```

## Send transaction

Your dApp can send transactions to the user's Radix Wallet for them to review, sign, and submit them to the Radix Network.

Radix transactions are built using "transaction manifests", that use a simple syntax to describe desired behavior. See [documentation on transaction manifest commands here](https://docs-babylon.radixdlt.com/main/scrypto/transaction-manifest/intro.html).

It is important to note that what your dApp sends to the Radix Wallet is actually a "transaction manifest stub". It is completed before submission by the Radix Wallet. For example, the Radix Wallet will automatically add a command to lock the necessary amount of network fees from one of the user's accounts. It may also add "assert" commands to the manifest according to user desires for expected returns.

**NOTE:** Information will be provided soon on a ["comforming" transaction manifest stub format](https://docs-babylon.radixdlt.com/main/standards/comforming-transactions.html) that ensures clear presentation and handling in the Radix Wallet.

### Build transaction manifest

This constructs the lines of a transaction manifest stub.

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

More examples can be found [here](./lib/__tests__/manifest-builder.spec.ts).

### sendTransaction

This sends the transaction manifest stub to a user's Radix Wallet, where it will be completed, presented to the user for review, signed as required, and submitted to the Radix network to be processed.

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
| canceledByUser                                   | User has canceled the request                                                                                                                                      |                                                                                                                                             |
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
