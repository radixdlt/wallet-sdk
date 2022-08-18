import { SubjectsType } from '../../messages/subjects'
import { filter, firstValueFrom, first, map } from 'rxjs'
import { createMessage } from '../../messages/create-message'
import { ok, ResultAsync } from 'neverthrow'
import {
  AccountAddressRequest,
  PersonaDataRequest,
  RequestItem,
  RequestTypes,
  requestType,
} from './_types'

export type RequestDataInput = Partial<{
  accountAddress: Omit<AccountAddressRequest, 'requestType'>
  personaData: Omit<PersonaDataRequest, 'requestType'>
}>

export const request =
  (subjects: SubjectsType) => (input: RequestDataInput) => {
    const transformedData = Object.entries(input)
      .map(([key, value]) => ({ requestType: key, ...value }))
      .filter((item): item is RequestItem =>
        Object.values(requestType).includes(item.requestType as RequestTypes)
      )

    // TODO: validate transformedData

    const message = createMessage({
      method: 'request',
      payload: transformedData,
    })

    subjects.outgoingMessageSubject.next(message)

    const response$ = subjects.responseSubject.pipe(
      filter((response) => response.requestId === message.requestId)
    )

    return {
      promise: () =>
        ResultAsync.fromPromise(
          firstValueFrom(response$),
          (error) => error as Error
        ),
      observable$: response$.pipe(
        first(),
        map((response) => ok(response))
      ),
    }
  }
