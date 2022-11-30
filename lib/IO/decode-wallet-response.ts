import { RequestTypeSchema, WalletSuccessResponse } from './schemas'

export const decodeWalletResponse = <R>(
  items: WalletSuccessResponse['items']
) =>
  items.reduce((acc, curr) => {
    switch (curr.requestType) {
      case RequestTypeSchema.usePersonaRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, persona: rest }
      }

      case RequestTypeSchema.loginRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, login: rest }
      }

      case RequestTypeSchema.oneTimeAccountsRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, oneTimeAccounts: rest.accounts }
      }

      case RequestTypeSchema.ongoingAccountsRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, ongoingAccounts: rest.accounts }
      }

      case RequestTypeSchema.oneTimePersonaDataRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, oneTimePersonaData: rest.fields }
      }

      case RequestTypeSchema.ongoingPersonaDataRead.value: {
        const { requestType, ...rest } = curr
        return { ...acc, ongoingPersonaData: rest.fields }
      }

      case RequestTypeSchema.sendTransactionWrite.value: {
        const { requestType, ...rest } = curr
        return { ...acc, ...rest }
      }

      default:
        return acc
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as R)
