import { err, ok, Result } from 'neverthrow'
import { createMessage } from '../../messages'
import {
  RequestDataInput,
  AccountAddressRequest,
  RequestItem,
  requestType,
  RequestTypes,
} from './_types'

export const transformInput = (
  input: RequestDataInput
): Result<AccountAddressRequest[], Error> => {
  try {
    return ok(
      Object.entries(input)
        .map(([key, value]) => ({ requestType: key, ...value }))
        .filter((item): item is RequestItem =>
          Object.values(requestType).includes(item.requestType as RequestTypes)
        )
    )
  } catch (error) {
    return err(error as Error)
  }
}

export const createRequestMessage = (input: RequestDataInput) =>
  transformInput(input).andThen((data) =>
    createMessage({
      method: 'request',
      payload: data,
    })
  )
