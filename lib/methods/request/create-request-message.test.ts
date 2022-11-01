import { ok } from 'neverthrow'
import { transformInput, createRequestMessage } from './create-request-message'

test('should ignore invalid request types', () => {
  expect(
    transformInput({
      invalidKey: {},
      accountAddresses: {},
      personaData: {},
    } as any)
  ).toEqual(
    ok([{ requestType: 'accountAddresses' }, { requestType: 'personaData' }])
  )
})

test('should create request message', () => {
  const result = createRequestMessage({
    accountAddresses: { numberOfAddresses: 1 },
    personaData: { fields: ['email'] },
  })

  if (result.isErr()) throw result.error

  expect(result.value.requestId).toBeDefined()

  const withoutRequestId: Partial<typeof result.value> = result.value

  delete withoutRequestId['requestId']

  expect(withoutRequestId).toEqual({
    method: 'request',
    payload: [
      {
        requestType: 'accountAddresses',
        numberOfAddresses: 1,
      },
      {
        requestType: 'personaData',
        fields: ['email'],
      },
    ],
  })
})
