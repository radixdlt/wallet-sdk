import { RequestTypeSchema, WalletInteractionSuccessResponse } from './schemas'

export const decodeWalletResponse = <R>(
  items: WalletInteractionSuccessResponse['items']
) => {
  const { discriminator, ...rest } = items

  return Object.entries(rest).reduce((acc, [key, value]) => {
    switch (key) {
      case RequestTypeSchema.auth.value: {
        const { discriminator: authDiscriminator, ...auth } = value
        if (authDiscriminator === 'loginWithChallenge') {
          const { persona, proof, challenge } = auth
          return { ...acc, persona, challenge, proof }
        } else {
          return { ...acc, persona: auth.persona }
        }
      }

      case RequestTypeSchema.oneTimeAccounts.value: {
        return { ...acc, oneTimeAccounts: value.accounts }
      }

      case RequestTypeSchema.ongoingAccounts.value: {
        return { ...acc, ongoingAccounts: value.accounts }
      }

      case RequestTypeSchema.oneTimePersonaData.value: {
        return { ...acc, oneTimePersonaData: value.fields }
      }

      case RequestTypeSchema.ongoingPersonaData.value: {
        return { ...acc, ongoingPersonaData: value.fields }
      }

      case RequestTypeSchema.send.value:
        return { ...acc, transactionIntentHash: value.transactionIntentHash }

      default:
        return acc
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as R)
}
