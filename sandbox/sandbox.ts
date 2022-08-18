import { RadixSdk } from '../lib/sdk'
import loglevel from 'loglevel'

const sdk = RadixSdk()

const app = () => {
  loglevel.setLevel('debug')

  sdk
    .request({
      personaData: { dataFields: ['email'], ongoing: true },
      accountAddress: { numberOfAddresses: 'any', ongoing: true },
    })
    .observable$.subscribe(console.log)
}

app()
