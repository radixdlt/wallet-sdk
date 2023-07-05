import { ResultAsync } from 'neverthrow'
import { array, boolean, literal, number, object, string, union, z } from 'zod'

export type Account = z.infer<typeof Account>
export const Account = object({
  address: string(),
  label: string(),
  appearanceId: number(),
})

export type Proof = z.infer<typeof Proof>
export const Proof = object({
  publicKey: string(),
  signature: string(),
  curve: union([literal('curve25519'), literal('secp256k1')]),
})

export type AccountProof = z.infer<typeof AccountProof>
export const AccountProof = object({
  accountAddress: string(),
  proof: Proof,
})

export type Persona = z.infer<typeof Persona>
export const Persona = object({ identityAddress: string(), label: string() })

export const personaDataField = {
  givenName: 'givenName',
  familyName: 'familyName',
  emailAddress: 'emailAddress',
  phoneNumber: 'phoneNumber',
} as const
export type PersonaDataField = z.infer<typeof PersonaDataField>
export const PersonaDataField = union([
  literal('givenName'),
  literal('familyName'),
  literal('emailAddress'),
  literal('phoneNumber'),
])

export type PersonaData = z.infer<typeof PersonaData>
export const PersonaData = object({ field: PersonaDataField, value: string() })

export type NumberOfAccounts = z.infer<typeof NumberOfAccounts>
export const NumberOfAccounts = object({
  quantifier: union([literal('exactly'), literal('atLeast')]),
  quantity: number().gte(1),
})

export type AccountsRequestItem = z.infer<typeof AccountsRequestItem>
export const AccountsRequestItem = object({
  challenge: string().optional(),
  numberOfAccounts: NumberOfAccounts,
})

export type AccountsRequestResponseItem = z.infer<
  typeof AccountsRequestResponseItem
>
export const AccountsRequestResponseItem = object({
  accounts: array(Account),
  challenge: string().optional(),
  proofs: array(AccountProof).optional(),
}).refine((data) => {
  if (data.challenge || data?.proofs) {
    return data.challenge && data?.proofs?.length
  }
  return true
}, 'missing challenge or proofs')

export type PersonaDataRequestItem = z.infer<typeof PersonaDataRequestItem>
export const PersonaDataRequestItem = object({
  fields: array(PersonaDataField),
})

export type PersonaDataRequestResponseItem = z.infer<
  typeof PersonaDataRequestResponseItem
>
export const PersonaDataRequestResponseItem = object({
  fields: array(PersonaData),
})

export type ResetRequestItem = z.infer<typeof ResetRequestItem>
export const ResetRequestItem = object({
  accounts: boolean(),
  personaData: boolean(),
})

export type LoginRequestResponseItem = z.infer<typeof LoginRequestResponseItem>
export const LoginRequestResponseItem = object({
  persona: Persona,
  challenge: string().optional(),
  proof: Proof.optional(),
}).refine((data) => {
  if (data.challenge || data.proof) {
    return data.challenge && data.proof
  }
  return true
}, 'missing challenge or proof')

export type WalletUnauthorizedRequestItems = z.infer<
  typeof WalletUnauthorizedRequestItems
>
export const WalletUnauthorizedRequestItems = object({
  discriminator: literal('unauthorizedRequest'),
  oneTimeAccounts: AccountsRequestItem.optional(),
})

export type AuthUsePersonaRequestItem = z.infer<
  typeof AuthUsePersonaRequestItem
>
export const AuthUsePersonaRequestItem = object({
  discriminator: literal('usePersona'),
  identityAddress: string(),
})

export type AuthLoginWithoutChallengeRequestItem = z.infer<
  typeof AuthLoginWithoutChallengeRequestItem
>
export const AuthLoginWithoutChallengeRequestItem = object({
  discriminator: literal('loginWithoutChallenge'),
})

export type AuthLoginWithChallengeRequestItem = z.infer<
  typeof AuthLoginWithChallengeRequestItem
>
export const AuthLoginWithChallengeRequestItem = object({
  discriminator: literal('loginWithChallenge'),
  challenge: string(),
})

export const AuthLoginRequestItem = union([
  AuthLoginWithoutChallengeRequestItem,
  AuthLoginWithChallengeRequestItem,
])
export const AuthRequestItem = union([
  AuthUsePersonaRequestItem,
  AuthLoginRequestItem,
])

export type WalletAuthorizedRequestItems = z.infer<
  typeof WalletAuthorizedRequestItems
>
export const WalletAuthorizedRequestItems = object({
  discriminator: literal('authorizedRequest'),
  auth: AuthRequestItem,
  reset: ResetRequestItem.optional(),
  oneTimeAccounts: AccountsRequestItem.optional(),
  ongoingAccounts: AccountsRequestItem.optional(),
})

export type WalletRequestItems = z.infer<typeof WalletRequestItems>
export const WalletRequestItems = union([
  WalletUnauthorizedRequestItems,
  WalletAuthorizedRequestItems,
])

export type SendTransactionItem = z.infer<typeof SendTransactionItem>
export const SendTransactionItem = object({
  transactionManifest: string(),
  version: number(),
  blobs: array(string()).optional(),
  message: string().optional(),
})

export type WalletTransactionItems = z.infer<typeof WalletTransactionItems>
export const WalletTransactionItems = object({
  discriminator: literal('transaction'),
  send: SendTransactionItem,
})

export type SendTransactionResponseItem = z.infer<
  typeof SendTransactionResponseItem
>
export const SendTransactionResponseItem = object({
  transactionIntentHash: string(),
})

export type WalletTransactionResponseItems = z.infer<
  typeof WalletTransactionResponseItems
>
const WalletTransactionResponseItems = object({
  discriminator: literal('transaction'),
  send: SendTransactionResponseItem,
})

export type CancelRequest = z.infer<typeof CancelRequest>
export const CancelRequest = object({
  discriminator: literal('cancelRequest'),
})

export type WalletInteractionItems = z.infer<typeof WalletInteractionItems>
export const WalletInteractionItems = union([
  WalletRequestItems,
  WalletTransactionItems,
  CancelRequest,
])

export type Metadata = z.infer<typeof Metadata>
export const Metadata = object({
  version: literal(2),
  networkId: number(),
  dAppDefinitionAddress: string(),
})

export type WalletInteraction = z.infer<typeof WalletInteraction>
export const WalletInteraction = object({
  interactionId: string(),
  metadata: Metadata,
  items: WalletInteractionItems,
})

export type WalletUnauthorizedRequestResponseItems = z.infer<
  typeof WalletUnauthorizedRequestResponseItems
>
const WalletUnauthorizedRequestResponseItems = object({
  discriminator: literal('unauthorizedRequest'),
  oneTimeAccounts: AccountsRequestResponseItem.optional(),
})

export type AuthLoginWithoutChallengeRequestResponseItem = z.infer<
  typeof AuthLoginWithoutChallengeRequestResponseItem
>
export const AuthLoginWithoutChallengeRequestResponseItem = object({
  discriminator: literal('loginWithoutChallenge'),
  persona: Persona,
})

export type AuthLoginWithChallengeRequestResponseItem = z.infer<
  typeof AuthLoginWithChallengeRequestResponseItem
>
export const AuthLoginWithChallengeRequestResponseItem = object({
  discriminator: literal('loginWithChallenge'),
  persona: Persona,
  challenge: string(),
  proof: Proof,
})

export const AuthLoginRequestResponseItem = union([
  AuthLoginWithoutChallengeRequestResponseItem,
  AuthLoginWithChallengeRequestResponseItem,
])

export type AuthUsePersonaRequestResponseItem = z.infer<
  typeof AuthUsePersonaRequestResponseItem
>
const AuthUsePersonaRequestResponseItem = object({
  discriminator: literal('usePersona'),
  persona: Persona,
})

export type AuthRequestResponseItem = z.infer<typeof AuthRequestResponseItem>
export const AuthRequestResponseItem = union([
  AuthUsePersonaRequestResponseItem,
  AuthLoginRequestResponseItem,
])

export type WalletAuthorizedRequestResponseItems = z.infer<
  typeof WalletAuthorizedRequestResponseItems
>
export const WalletAuthorizedRequestResponseItems = object({
  discriminator: literal('authorizedRequest'),
  auth: AuthRequestResponseItem,
  oneTimeAccounts: AccountsRequestResponseItem.optional(),
  ongoingAccounts: AccountsRequestResponseItem.optional(),
})

export type WalletRequestResponseItems = z.infer<
  typeof WalletRequestResponseItems
>
export const WalletRequestResponseItems = union([
  WalletUnauthorizedRequestResponseItems,
  WalletAuthorizedRequestResponseItems,
])

export type WalletInteractionResponseItems = z.infer<
  typeof WalletInteractionResponseItems
>
const WalletInteractionResponseItems = union([
  WalletRequestResponseItems,
  WalletTransactionResponseItems,
])

export type WalletInteractionSuccessResponse = z.infer<
  typeof WalletInteractionSuccessResponse
>
export const WalletInteractionSuccessResponse = object({
  discriminator: literal('success'),
  interactionId: string(),
  items: WalletInteractionResponseItems,
})

export type WalletInteractionFailureResponse = z.infer<
  typeof WalletInteractionFailureResponse
>
export const WalletInteractionFailureResponse = object({
  discriminator: literal('failure'),
  interactionId: string(),
  error: string(),
  message: string().optional(),
})

export type WalletInteractionResponse = z.infer<
  typeof WalletInteractionResponse
>
export const WalletInteractionResponse = union([
  WalletInteractionSuccessResponse,
  WalletInteractionFailureResponse,
])

export const messageLifeCycleEventType = {
  receivedByExtension: 'receivedByExtension',
  receivedByWallet: 'receivedByWallet',
  requestCancelSuccess: 'requestCancelSuccess',
  requestCancelFail: 'requestCancelFail',
} as const

export type MessageLifeCycleEvent = z.infer<typeof MessageLifeCycleEvent>
export const MessageLifeCycleEvent = object({
  eventType: union([
    literal(messageLifeCycleEventType.receivedByExtension),
    literal(messageLifeCycleEventType.receivedByWallet),
    literal(messageLifeCycleEventType.requestCancelSuccess),
    literal(messageLifeCycleEventType.requestCancelFail),
  ]),
  interactionId: string(),
})

export type IncomingMessage = z.infer<typeof IncomingMessage>
const IncomingMessage = union([
  MessageLifeCycleEvent,
  WalletInteractionResponse,
])

export const eventType = {
  outgoingMessage: 'radix#chromeExtension#send',
  incomingMessage: 'radix#chromeExtension#receive',
} as const

export type CallbackFns = {
  eventCallback: (messageEvent: MessageLifeCycleEvent['eventType']) => void
  requestControl: (api: {
    cancelRequest: () => ResultAsync<
      'requestCancelSuccess',
      'requestCancelFail'
    >
    getRequest: () => WalletInteraction
  }) => void
}
