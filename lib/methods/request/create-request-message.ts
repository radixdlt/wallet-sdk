import { ok, Result } from 'neverthrow'
import { createMessage } from '../../messages'
import { methodType } from '../_types'
import { RequestMethodInput, WalletRequestItem, requestTypeSet } from './_types'

type CreateMessageInput = RequestMethodInput

export const transformInput = (
  input: CreateMessageInput
): Result<WalletRequestItem[], never> =>
  ok(
    Object.entries(input)
      .map(([key, value]) => ({
        requestType: key,
        ...value,
      }))
      .filter((item): item is WalletRequestItem =>
        requestTypeSet.has(item.requestType)
      )
  )

export const createRequestMessage = (input: CreateMessageInput) =>
  transformInput(input).andThen((payload) =>
    createMessage({
      method: methodType.request,
      payload,
    })
  )
