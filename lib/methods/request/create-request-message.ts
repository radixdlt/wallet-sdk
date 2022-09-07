import { ok, Result } from 'neverthrow'
import { createMessage } from '../../messages'
import { methodType } from '../_types'
import {
  RequestMethodInput,
  RequestDataItem,
  requestType,
  RequestTypes,
} from './_types'

export const transformInput = (
  input: RequestMethodInput
): Result<RequestDataItem[], never> =>
  ok(
    Object.entries(input)
      .map(([key, value]) => ({ requestType: key, ...value }))
      .filter((item): item is RequestDataItem =>
        Object.values(requestType).includes(item.requestType as RequestTypes)
      )
  )

export const createRequestMessage = (input: RequestMethodInput) =>
  transformInput(input).andThen((payload) =>
    createMessage({
      method: methodType.request,
      payload,
    })
  )
