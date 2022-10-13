import { ok, Result } from 'neverthrow'
import { createMessage } from '../../messages'
import { methodType } from '../_types'
import { RequestMethodInput, WalletRequestItem, requestTypeSet } from './_types'

export const transformInput = (
  input: RequestMethodInput
): Result<WalletRequestItem[], never> =>
  ok(
    Object.entries(input)
      .map(([key, value]) => ({
        requestType: key,
        ongoing: !!value.ongoing,
        reset: !!value.reset,
        ...value,
      }))
      .filter((item): item is WalletRequestItem =>
        requestTypeSet.has(item.requestType)
      )
  )

export const createRequestMessage = (input: RequestMethodInput) =>
  transformInput(input).andThen((payload) =>
    createMessage({
      method: methodType.request,
      payload,
    })
  )
