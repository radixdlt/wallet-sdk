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
    ok([
      { requestType: 'accountAddresses', ongoing: false, reset: false },
      { requestType: 'personaData', ongoing: false, reset: false },
    ])
  )
})

test('should create request message', () => {
  const result = createRequestMessage({
    accountAddresses: { numberOfAddresses: 1 },
    personaData: { fields: ['email'], ongoing: true, reset: true },
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
        ongoing: false,
        numberOfAddresses: 1,
        reset: false,
      },
      {
        requestType: 'personaData',
        ongoing: true,
        fields: ['email'],
        reset: true,
      },
    ],
  })
})
