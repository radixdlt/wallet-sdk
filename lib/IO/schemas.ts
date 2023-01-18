import z, { boolean, literal, number, object, string, union } from 'zod'

export const RequestTypeSchema = {
  oneTimeAccountsRead: literal('oneTimeAccountsRead'),
  ongoingAccountsRead: literal('ongoingAccountsRead'),
  oneTimePersonaDataRead: literal('oneTimePersonaDataRead'),
  ongoingPersonaDataRead: literal('ongoingPersonaDataRead'),
  usePersonaRead: literal('usePersonaRead'),
  loginRead: literal('loginRead'),
  sendTransactionWrite: literal('sendTransactionWrite'),
} as const

export const ErrorTypeSchema = literal('rejectedByUser')

const AccountSchema = object({
  address: string(),
  label: string(),
  appearanceId: number(),
})

const AccountWithProofOfOwnershipSchema = object({
  account: AccountSchema,
  challenge: string(),
  signature: string(),
})

const PersonaDataFieldSchema = object({
  field: string(),
  value: string(),
})

const MetadataSchema = object({
  networkId: number(),
  dAppId: string(),
})

const OneTimeAccountsReadRequestItemSchema = object({
  requestType: RequestTypeSchema.oneTimeAccountsRead,
  requiresProofOfOwnership: boolean(),
  numberOfAccounts: number().optional(),
})

const OneTimeAccountsWithProofOfOwnershipResponseItemSchema = object({
  requestType: RequestTypeSchema.oneTimeAccountsRead,
  accounts: AccountWithProofOfOwnershipSchema.array(),
})

const OneTimeAccountsWithoutProofOfOwnershipResponseItemSchema = object({
  requestType: RequestTypeSchema.oneTimeAccountsRead,
  accounts: AccountSchema.array(),
})

export const OneTimeAccountsResponseItemSchema = union([
  OneTimeAccountsWithProofOfOwnershipResponseItemSchema,
  OneTimeAccountsWithoutProofOfOwnershipResponseItemSchema,
])

const OngoingAccountsReadRequestItemSchema = object({
  requestType: RequestTypeSchema.ongoingAccountsRead,
  requiresProofOfOwnership: boolean(),
  numberOfAccounts: number().optional(),
})

const OngoingAccountsWithProofOfOwnershipResponseItemSchema = object({
  requestType: RequestTypeSchema.ongoingAccountsRead,
  accounts: AccountWithProofOfOwnershipSchema.array(),
})

const OngoingAccountsWithoutProofOfOwnershipResponseItemSchema = object({
  requestType: RequestTypeSchema.ongoingAccountsRead,
  accounts: AccountSchema.array(),
})

const OngoingAccountsResponseItemSchema = union([
  OngoingAccountsWithProofOfOwnershipResponseItemSchema,
  OngoingAccountsWithoutProofOfOwnershipResponseItemSchema,
])

const OneTimePersonaDataReadRequestItemSchema = object({
  requestType: RequestTypeSchema.oneTimePersonaDataRead,
  fields: string().array(),
})

const OneTimePersonaDataResponseItemSchema = object({
  requestType: RequestTypeSchema.oneTimePersonaDataRead,
  fields: PersonaDataFieldSchema.array(),
})

const OngoingPersonaDataReadRequestItemSchema = object({
  requestType: RequestTypeSchema.ongoingPersonaDataRead,
  fields: string().array(),
})

const OngoingPersonaDataResponseItemSchema = object({
  requestType: RequestTypeSchema.ongoingPersonaDataRead,
  fields: PersonaDataFieldSchema.array(),
})

const UsePersonaReadRequestItemSchema = object({
  requestType: RequestTypeSchema.usePersonaRead,
  id: string(),
})

const UsePersonaResponseItemSchema = object({
  requestType: RequestTypeSchema.usePersonaRead,
  id: string(),
})

const LoginReadRequestItemSchema = object({
  requestType: RequestTypeSchema.loginRead,
  challenge: string().optional(),
})

const LoginWithoutChallengeResponseItemSchema = object({
  requestType: RequestTypeSchema.loginRead,
  personaId: string(),
})

const LoginWithChallengeResponseItemSchema = object({
  requestType: RequestTypeSchema.loginRead,
  personaId: string(),
  challenge: string(),
  publicKey: string(),
  signature: string(),
  identityComponentAddress: string(),
})

const LoginResponseItemSchema = union([
  LoginWithoutChallengeResponseItemSchema,
  LoginWithChallengeResponseItemSchema,
])

const SendTransactionWriteRequestItemSchema = object({
  requestType: RequestTypeSchema.sendTransactionWrite,
  transactionManifest: string(),
  version: number(),
  blobs: string().array().optional(),
  message: string().optional(),
})

const SendTransactionResponseItemSchema = object({
  requestType: RequestTypeSchema.sendTransactionWrite,
  transactionIntentHash: string(),
})

const RequestItemSchema = union([
  OneTimeAccountsReadRequestItemSchema,
  OngoingAccountsReadRequestItemSchema,
  // OneTimePersonaDataReadRequestItemSchema,
  // OngoingPersonaDataReadRequestItemSchema,
  // UsePersonaReadRequestItemSchema,
  LoginReadRequestItemSchema,
  SendTransactionWriteRequestItemSchema,
])

const ResponseItemSchema = union([
  OneTimeAccountsResponseItemSchema,
  OngoingAccountsResponseItemSchema,
  OneTimePersonaDataResponseItemSchema,
  OngoingPersonaDataResponseItemSchema,
  UsePersonaResponseItemSchema,
  LoginResponseItemSchema,
  SendTransactionResponseItemSchema,
])

export const WalletRequestSchema = object({
  requestId: string(),
  items: RequestItemSchema.array(),
  metadata: MetadataSchema,
})

export const WalletSuccessResponseSchema = object({
  requestId: string(),
  items: ResponseItemSchema.array(),
})

const WalletErrorResponseSchema = object({
  requestId: string(),
  error: ErrorTypeSchema,
  message: string().optional(),
})

export const WalletResponseSchema = union([
  WalletSuccessResponseSchema,
  WalletErrorResponseSchema,
])

export type Account = z.infer<typeof AccountSchema>

export type AccountWithProofOfOwnership = z.infer<
  typeof AccountWithProofOfOwnershipSchema
>

export type Metadata = z.infer<typeof MetadataSchema>

export type PersonaDataField = z.infer<typeof PersonaDataFieldSchema>

export type OneTimeAccountsReadRequestItem = z.infer<
  typeof OneTimeAccountsReadRequestItemSchema
>

export type OneTimeAccountsWithoutProofOfOwnershipResponseItem = z.infer<
  typeof OneTimeAccountsWithoutProofOfOwnershipResponseItemSchema
>

export type OneTimeAccountsWithProofOfOwnershipResponseItem = z.infer<
  typeof OneTimeAccountsWithProofOfOwnershipResponseItemSchema
>

export type OneTimeAccountsResponseItem = z.infer<
  typeof OneTimeAccountsResponseItemSchema
>

export type OngoingAccountsReadRequestItem = z.infer<
  typeof OngoingAccountsReadRequestItemSchema
>

export type OngoingAccountsResponseItem = z.infer<
  typeof OngoingAccountsResponseItemSchema
>

export type OneTimePersonaDataReadRequestItem = z.infer<
  typeof OneTimePersonaDataReadRequestItemSchema
>

export type OneTimePersonaDataResponseItem = z.infer<
  typeof OneTimePersonaDataResponseItemSchema
>

export type OngoingPersonaDataReadRequestItem = z.infer<
  typeof OngoingPersonaDataReadRequestItemSchema
>

export type OngoingPersonaDataResponseItem = z.infer<
  typeof OngoingPersonaDataResponseItemSchema
>

export type UsePersonaReadRequestItem = z.infer<
  typeof UsePersonaReadRequestItemSchema
>

export type UsePersonaResponseItem = z.infer<
  typeof UsePersonaResponseItemSchema
>

export type LoginReadRequestItem = z.infer<typeof LoginReadRequestItemSchema>

export type LoginWithChallengeResponseItem = z.infer<
  typeof LoginWithChallengeResponseItemSchema
>

export type LoginWithoutChallengeResponseItem = z.infer<
  typeof LoginWithoutChallengeResponseItemSchema
>

export type LoginResponseItem = z.infer<typeof LoginResponseItemSchema>

export type SendTransactionWriteRequestItem = z.infer<
  typeof SendTransactionWriteRequestItemSchema
>

export type SendTransactionResponseItem = z.infer<
  typeof SendTransactionResponseItemSchema
>

export type RequestItem = z.infer<typeof RequestItemSchema>

export type ResponseItem = z.infer<typeof ResponseItemSchema>

export type WalletRequest = z.infer<typeof WalletRequestSchema>

export type WalletResponse = z.infer<typeof WalletResponseSchema>

export type WalletSuccessResponse = z.infer<typeof WalletSuccessResponseSchema>
