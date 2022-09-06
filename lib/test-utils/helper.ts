import { IncomingMessage } from '../messages'
import { AccountAddressWalletResponse, requestType } from '../methods'

const TestHelper = () => {
  const createAddresses = (numberOfAddresses: number) =>
    new Array(numberOfAddresses)
      .fill(null)
      .map((_, index) => ({
        address: `rdx${Buffer.from(crypto.randomUUID())
          .toString('hex')
          .slice(0, 32)}`,
        label: `address-${index}`,
      }))
  const createAccountAddressResponse = (
    numberOfAddresses: number
  ): AccountAddressWalletResponse => ({
    requestType: requestType.accountAddresses,
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
