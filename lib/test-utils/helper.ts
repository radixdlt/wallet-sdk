import { IncomingMessage } from '../messages'
import { AccountAddressWalletResponse } from '../methods'

const TestHelper = () => {
  const createAddresses = (numberOfAddresses: number) =>
    new Array(numberOfAddresses)
      .fill(null)
      .map(
        () =>
          `rdx${Buffer.from(crypto.randomUUID()).toString('hex').slice(0, 32)}`
      )
  const createAccountAddressResponse = (
    numberOfAddresses: number
  ): AccountAddressWalletResponse => ({
    requestType: 'accountAddress',
    addresses: createAddresses(numberOfAddresses),
  })

  const createRequestReponse = (
    requestId: string,
    input: any
  ): IncomingMessage => ({
    requestId,
    method: 'request',
    payload: input,
  })
  return {
    createAccountAddressResponse,
    createRequestReponse,
  }
}

export const testHelper = TestHelper()
