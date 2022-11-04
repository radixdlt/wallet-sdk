import { login, loginWithChallenge } from './login'
import {
  oneTimeAccountAddresses,
  oneTimeAccountAddressesWithProofOfOwnership,
} from './one-time-account-addresses'
import {
  ongoingAccountAddresses,
  ongoingAccountAddressesWithProofOfOwnership,
} from './ongoing-account-addresses'
import { usePersona } from './persona'
import { oneTimePersonaData } from './one-time-persona-data'
import { ongoingPersonaData } from './ongoing-time-persona-data'

export const requestItem = {
  usePersona,
  oneTimeAccountAddresses: {
    withoutProofOfOwnership: oneTimeAccountAddresses,
    withProofOfOwnership: oneTimeAccountAddressesWithProofOfOwnership,
  },
  ongoingAccountAddresses: {
    withoutProofOfOwnership: ongoingAccountAddresses,
    withProofOfOwnership: ongoingAccountAddressesWithProofOfOwnership,
  },
  login: {
    withoutChallenge: login,
    withChallenge: loginWithChallenge,
  },
  oneTimePersonaData,
  ongoingPersonaData,
} as const
