import { ok, Result } from 'neverthrow'
import { createMessage } from '../../messages'
import { RequestInput, RequestItem, requestType, RequestTypes } from './_types'

export const transformInput = (
  input: RequestInput
): Result<RequestItem[], never> =>
  ok(
    Object.entries(input)
      .map(([key, value]) => ({ requestType: key, ...value }))
      .filter((item): item is RequestItem =>
        Object.values(requestType).includes(item.requestType as RequestTypes)
      )
  )

export const createRequestMessage = (input: RequestInput) =>
  transformInput(input).andThen((payload) =>
    createMessage({
      method: 'request',
      payload,
    })
  )
