import {
  test as base,
  BrowserContext,
  chromium,
  expect,
} from '@playwright/test'
import path from 'path'
import fs from 'fs'

const pathToGumballWasm = path.join(
  __dirname,
  '../sandbox/gumball_machine.wasm'
)
const gumballWasm = fs.readFileSync(pathToGumballWasm)

const delayAsync = (delayTime = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayTime)
  })

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../sandbox/extension')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers()
    if (!background) background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})

test('instantiate gumball component and buy 1 GUM', async ({
  extensionId,
  context,
}) => {
  const extension = await context.newPage()
  const dApp = await context.newPage()

  await extension.goto(`chrome-extension://${extensionId}/index.html`)
  await dApp.goto('http://localhost:5173')

  const createAccount = extension.locator(
    '#root > div.MuiBox-root.css-hlmef6 > div > div.MuiBox-root.css-1p021x2 > div > button'
  )
  await Promise.all([
    createAccount.click(),
    extension.waitForResponse((resp) =>
      resp.url().includes('radixdlt.com/transaction')
    ),
  ])

  await expect(extension.locator('text=No transactions found')).toHaveCount(1)

  await dApp.locator('#fetchAccountAddress').click()
  const accountAddress = await dApp.locator('#accountAddress').innerText()

  await dApp.locator('input#packageFileInput').setInputFiles({
    name: 'gumball_machine.wasm',
    mimeType: 'text/plain',
    buffer: gumballWasm,
  })

  await dApp.locator('#publishPackage').click()

  await Promise.all([
    await extension.locator('text=Submit').click(),
    extension.waitForResponse((resp) =>
      resp.url().includes('radixdlt.com/transaction')
    ),
  ])

  await delayAsync(1000)

  const packageAddress = dApp.locator('#packageAddress')

  await dApp.locator('#instantiateComponent').click({ delay: 1000 })

  await delayAsync(100)

  await Promise.all([
    await extension.locator('text=Submit').first().click(),
    extension.waitForResponse((resp) =>
      resp.url().includes('radixdlt.com/transaction')
    ),
  ])

  await delayAsync(1000)

  await dApp.locator('#buyGumball').click({ delay: 1000 })

  await Promise.all([
    await extension.locator('text=Submit').first().click(),
    extension.waitForResponse((resp) =>
      resp.url().includes('radixdlt.com/transaction')
    ),
  ])

  await Promise.all([
    await dApp.locator('#checkBalance').first().click(),
    dApp.waitForResponse((resp) =>
      resp.url().includes('radixdlt.com/component')
    ),
  ])

  await delayAsync(1000)

  const amount = await dApp.locator('#balance').innerText()

  expect(amount, 'Check balance').toBe(
    'I have 1 GUM, and the machine has 99 GUM.'
  )
})
