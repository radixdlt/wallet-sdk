import { requestType, Wallet } from '../_types'

export const decodeWalletResponse = <R>(walletResponse: Wallet['response']) =>
  walletResponse.reduce((acc, curr) => {
    switch (curr.requestType) {
      case requestType.persona:
        return { ...acc, persona: curr.persona }

      case requestType.login: {
        const { requestType, ...rest } = curr
        return { ...acc, login: rest }
      }

      case requestType.oneTimeAccountAddresses:
      case requestType.ongoingAccountAddresses: {
        return {
          ...acc,
          [curr.requestType]: curr.accountAddresses,
        }
      }

      case requestType.oneTimePersonaData:
      case requestType.ongoingPersonaData: {
        return {
          ...acc,
          [curr.requestType]: curr.personaData,
        }
      }

      case requestType.sendTransaction:
        return { ...acc, transactionIntentHash: curr.transactionIntentHash }

      default:
        return acc
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as R)
