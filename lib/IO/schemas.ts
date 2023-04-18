import z, { boolean, literal, number, object, string, union } from 'zod'

export const RequestTypeSchema = {
  oneTimeAccounts: literal('oneTimeAccounts'),
  ongoingAccounts: literal('ongoingAccounts'),
  oneTimePersonaData: literal('oneTimePersonaData'),
  ongoingPersonaData: literal('ongoingPersonaData'),
  auth: literal('auth'),
  send: literal('send'),
} as const

export const ErrorTypeSchema = union([
  literal('rejectedByUser'),
  literal('wrongNetwork'),
  literal('failedToPrepareTransaction'),
  literal('failedToCompileTransaction'),
  literal('failedToSignTransaction'),
  literal('failedToSubmitTransaction'),
  literal('failedToPollSubmittedTransaction'),
  literal('failedToFindAccountWithEnoughFundsToLockFee'),
  literal('submittedTransactionWasDuplicate'),
  literal('submittedTransactionHasFailedTransactionStatus'),
  literal('submittedTransactionHasRejectedTransactionStatus'),
  literal('wrongAccountType'),
  literal('unknownWebsite'),
  literal('radixJsonNotFound'),
  literal('unknownDappDefinitionAddress'),
  literal('invalidPersona'),
])

export const personaDataField = {
  givenName: 'givenName',
  familyName: 'familyName',
  emailAddress: 'emailAddress',
  phoneNumber: 'phoneNumber',
} as const

export const PersonaDataFieldSchema = union([
  literal(personaDataField.emailAddress),
  literal(personaDataField.familyName),
  literal(personaDataField.givenName),
  literal(personaDataField.phoneNumber),
])

export type PersonaDataField = z.infer<typeof PersonaDataFieldSchema>

const AccountSchema = object({
  address: string(),
  label: string(),
  appearanceId: number(),
})

export type Account = z.infer<typeof AccountSchema>

const AccountWithProofOfOwnershipSchema = object({
  account: AccountSchema,
  challenge: string(),
  signature: string(),
})

export type AccountWithProofOfOwnership = z.infer<
  typeof AccountWithProofOfOwnershipSchema
>

const PersonaSchema = object({
  identityAddress: string(),
  label: string(),
})

export type Persona = z.infer<typeof PersonaSchema>

const PersonaDataSchema = object({
  field: PersonaDataFieldSchema,
  value: string(),
})

export type PersonaData = z.infer<typeof PersonaDataSchema>

const NumberOfAccountsQuantifierSchema = union([
  literal('exactly'),
  literal('atLeast'),
])

export type NumberOfAccountsQuantifier = z.infer<
  typeof NumberOfAccountsQuantifierSchema
>

const NumberOfAccountsSchema = object({
  quantifier: union([literal('exactly'), literal('atLeast')]),
  quantity: number(),
})

export type NumberOfAccounts = z.infer<typeof NumberOfAccountsSchema>

const MetadataSchema = object({
  networkId: number(),
  dAppDefinitionAddress: string(),
})

export type Metadata = z.infer<typeof MetadataSchema>

const OneTimeAccountsRequestItemSchema = object({
  requiresProofOfOwnership: boolean(),
  numberOfAccounts: NumberOfAccountsSchema,
})

export type OneTimeAccountsRequestItem = z.infer<
  typeof OneTimeAccountsRequestItemSchema
>

const OneTimeAccountsWithProofOfOwnershipRequestResponseItemSchema = object({
  accounts: AccountWithProofOfOwnershipSchema.array(),
})

export type OneTimeAccountsWithProofOfOwnershipRequestResponseItem = z.infer<
  typeof OneTimeAccountsWithProofOfOwnershipRequestResponseItemSchema
>

const OneTimeAccountsWithoutProofOfOwnershipRequestResponseItemSchema = object({
  accounts: AccountSchema.array(),
})

export type OneTimeAccountsWithoutProofOfOwnershipRequestResponseItem = z.infer<
  typeof OneTimeAccountsWithoutProofOfOwnershipRequestResponseItemSchema
>

export const OneTimeAccountsRequestResponseItemSchema = union([
  OneTimeAccountsWithProofOfOwnershipRequestResponseItemSchema,
  OneTimeAccountsWithoutProofOfOwnershipRequestResponseItemSchema,
])

export type OneTimeAccountsRequestResponseItem = z.infer<
  typeof OneTimeAccountsRequestResponseItemSchema
>

const OngoingAccountsRequestItemSchema = object({
  requiresProofOfOwnership: boolean(),
  numberOfAccounts: NumberOfAccountsSchema,
})

export type OngoingAccountsRequestItem = z.infer<
  typeof OngoingAccountsRequestItemSchema
>

const OngoingAccountsWithProofOfOwnershipRequestResponseItemSchema = object({
  accounts: AccountWithProofOfOwnershipSchema.array(),
})

export type OngoingAccountsWithProofOfOwnershipRequestResponseItem = z.infer<
  typeof OngoingAccountsWithProofOfOwnershipRequestResponseItemSchema
>

const OngoingAccountsWithoutProofOfOwnershipRequestResponseItemSchema = object({
  accounts: AccountSchema.array(),
})

export type OngoingAccountsWithoutProofOfOwnershipRequestResponseItem = z.infer<
  typeof OngoingAccountsWithoutProofOfOwnershipRequestResponseItemSchema
>

const OngoingAccountsRequestResponseItemSchema = union([
  OngoingAccountsWithProofOfOwnershipRequestResponseItemSchema,
  OngoingAccountsWithoutProofOfOwnershipRequestResponseItemSchema,
])

export type OngoingAccountsRequestResponseItem = z.infer<
  typeof OngoingAccountsRequestResponseItemSchema
>

const OneTimePersonaDataRequestItemSchema = object({
  fields: string().array(),
})

export type OneTimePersonaDataRequestItem = z.infer<
  typeof OneTimePersonaDataRequestItemSchema
>

const OneTimePersonaDataRequestResponseItemSchema = object({
  fields: PersonaDataSchema.array(),
})

export type OneTimePersonaDataRequestResponseItem = z.infer<
  typeof OneTimePersonaDataRequestResponseItemSchema
>

const OngoingPersonaDataRequestItemSchema = object({
  fields: PersonaDataFieldSchema.array(),
})

export type OngoingPersonaDataRequestItem = z.infer<
  typeof OngoingPersonaDataRequestItemSchema
>

const OngoingPersonaDataRequestResponseItemSchema = object({
  fields: PersonaDataSchema.array(),
})

export type OngoingPersonaDataRequestResponseItem = z.infer<
  typeof OngoingPersonaDataRequestResponseItemSchema
>

const AuthUsePersonaRequestItemSchema = object({
  discriminator: literal('usePersona'),
  identityAddress: string(),
})

export type AuthUsePersonaRequestItem = z.infer<
  typeof AuthUsePersonaRequestItemSchema
>

const AuthUsePersonaRequestResponseItemSchema = object({
  discriminator: literal('usePersona'),
  persona: PersonaSchema,
})

export type AuthUsePersonaRequestResponseItem = z.infer<
  typeof AuthUsePersonaRequestResponseItemSchema
>

const AuthLoginRequestItemSchema = object({
  discriminator: literal('login'),
  challenge: string().optional(),
})

export type AuthLoginRequestItem = z.infer<typeof AuthLoginRequestItemSchema>

const AuthLoginWithoutChallengeRequestResponseItemSchema = object({
  discriminator: literal('loginWithoutChallenge'),
  persona: PersonaSchema,
})

export type AuthLoginWithoutChallengeRequestResponseItem = z.infer<
  typeof AuthLoginWithoutChallengeRequestResponseItemSchema
>

const AuthLoginWithChallengeRequestResponseItemSchema = object({
  discriminator: literal('loginWithChallenge'),
  persona: PersonaSchema,
  challenge: string(),
  publicKey: string(),
  signature: string(),
})

export type AuthLoginWithChallengeRequestResponseItem = z.infer<
  typeof AuthLoginWithChallengeRequestResponseItemSchema
>

export const AuthLoginRequestResponseItemSchema = union([
  AuthLoginWithoutChallengeRequestResponseItemSchema,
  AuthLoginWithChallengeRequestResponseItemSchema,
])

export type AuthLoginRequestResponseItem = z.infer<
  typeof AuthLoginRequestResponseItemSchema
>

export const AuthRequestItemSchema = union([
  AuthUsePersonaRequestItemSchema,
  AuthLoginRequestItemSchema,
])

export type AuthRequestItem = z.infer<typeof AuthRequestItemSchema>

const AuthRequestResponseItemSchema = union([
  AuthUsePersonaRequestResponseItemSchema,
  AuthLoginRequestResponseItemSchema,
])

export type AuthRequestResponseItem = z.infer<
  typeof AuthRequestResponseItemSchema
>

export type ResetRequestItem = z.infer<typeof ResetRequestSchema>

const ResetRequestSchema = object({
  accounts: boolean(),
  personaData: boolean(),
})

const SendTransactionRequestItemSchema = object({
  transactionManifest: string(),
  version: number(),
  blobs: string().array().optional(),
  message: string().optional(),
})

export type SendTransactionItem = z.infer<
  typeof SendTransactionRequestItemSchema
>

const SendTransactionResponseItemSchema = object({
  transactionIntentHash: string(),
})

export type SendTransactionResponseItem = z.infer<
  typeof SendTransactionResponseItemSchema
>

const WalletUnauthorizedRequestItemsSchema = object({
  discriminator: literal('unauthorizedRequest'),
  oneTimeAccounts: OneTimeAccountsRequestItemSchema.optional(),
  oneTimePersonaData: OneTimePersonaDataRequestItemSchema.optional(),
})

export type WalletUnauthorizedRequestItems = z.infer<
  typeof WalletUnauthorizedRequestItemsSchema
>

const WalletAuthorizedRequestItemsSchema = object({
  discriminator: literal('authorizedRequest'),
  auth: AuthRequestItemSchema,
  oneTimeAccounts: OneTimeAccountsRequestItemSchema.optional(),
  ongoingAccounts: OngoingAccountsRequestItemSchema.optional(),
  oneTimePersonaData: OneTimePersonaDataRequestItemSchema.optional(),
  ongoingPersonaData: OngoingPersonaDataRequestItemSchema.optional(),
  reset: ResetRequestSchema.optional(),
})

export type WalletAuthorizedRequestItems = z.infer<
  typeof WalletAuthorizedRequestItemsSchema
>

export const WalletRequestItemsSchema = union([
  WalletUnauthorizedRequestItemsSchema,
  WalletAuthorizedRequestItemsSchema,
])

export type WalletRequestItems = z.infer<typeof WalletRequestItemsSchema>

const WalletTransactionItemsSchema = object({
  discriminator: literal('transaction'),
  send: SendTransactionRequestItemSchema,
})

export type WalletTransactionItems = z.infer<
  typeof WalletTransactionItemsSchema
>

const WalletCancelRequestItemsSchema = object({
  discriminator: literal('cancel'),
})

const WalletInteractionItemsSchema = union([
  WalletRequestItemsSchema,
  WalletTransactionItemsSchema,
  WalletCancelRequestItemsSchema,
])

export type WalletInteractionItems = z.infer<
  typeof WalletInteractionItemsSchema
>

export const WalletInteractionSchema = object({
  interactionId: string(),
  items: WalletInteractionItemsSchema,
  metadata: MetadataSchema,
})

export type WalletInteraction = z.infer<typeof WalletInteractionSchema>

export const WalletUnauthorizedRequestResponseItemsSchema = object({
  discriminator: literal('unauthorizedRequest'),
  oneTimeAccounts: OneTimeAccountsRequestResponseItemSchema.optional(),
  oneTimePersonaData: OneTimePersonaDataRequestResponseItemSchema.optional(),
})

export type WalletUnauthorizedRequestResponseItems = z.infer<
  typeof WalletUnauthorizedRequestResponseItemsSchema
>

export const WalletAuthorizedRequestResponseItemsSchema = object({
  discriminator: literal('authorizedRequest'),
  auth: AuthRequestResponseItemSchema,
  oneTimeAccounts: OneTimeAccountsRequestResponseItemSchema.optional(),
  ongoingAccounts: OngoingAccountsRequestResponseItemSchema.optional(),
  oneTimePersonaData: OneTimePersonaDataRequestResponseItemSchema.optional(),
  ongoingPersonaData: OngoingPersonaDataRequestResponseItemSchema.optional(),
})

export type WalletAuthorizedRequestResponseItems = z.infer<
  typeof WalletAuthorizedRequestResponseItemsSchema
>

export const WalletRequestResponseItemsSchema = union([
  WalletUnauthorizedRequestResponseItemsSchema,
  WalletAuthorizedRequestResponseItemsSchema,
])

export type WalletRequestResponseItems = z.infer<
  typeof WalletRequestResponseItemsSchema
>

export const WalletTransactionResponseItemsSchema = object({
  discriminator: literal('transaction'),
  send: SendTransactionResponseItemSchema,
})

export type WalletTransactionResponseItems = z.infer<
  typeof WalletTransactionResponseItemsSchema
>

export const WalletInteractionResponseItemsSchema = union([
  WalletRequestResponseItemsSchema,
  WalletTransactionResponseItemsSchema,
])

export type WalletInteractionResponseItems = z.infer<
  typeof WalletInteractionResponseItemsSchema
>

export const WalletInteractionSuccessResponseSchema = object({
  discriminator: literal('success'),
  interactionId: string(),
  items: WalletInteractionResponseItemsSchema,
})

export type WalletInteractionSuccessResponse = z.infer<
  typeof WalletInteractionSuccessResponseSchema
>

export const WalletInteractionFailureResponseSchema = object({
  discriminator: literal('failure'),
  interactionId: string(),
  error: ErrorTypeSchema,
  message: string().optional(),
})

export type WalletInteractionFailureResponse = z.infer<
  typeof WalletInteractionFailureResponseSchema
>

export const WalletInteractionResponseSchema = union([
  WalletInteractionSuccessResponseSchema,
  WalletInteractionFailureResponseSchema,
])

export type WalletInteractionResponse = z.infer<
  typeof WalletInteractionResponseSchema
>
