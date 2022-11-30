import { login } from './login'
import { oneTimeAccounts } from './one-time-accounts'
import { ongoingAccounts } from './ongoing-accounts'
import { usePersona } from './use-persona'
import { oneTimePersonaData } from './one-time-persona-data'
import { ongoingPersonaData } from './ongoing-persona-data'

export const requestItem = {
  oneTimeAccounts,
  ongoingAccounts,
  oneTimePersonaData,
  ongoingPersonaData,
  login,
  usePersona,
} as const
