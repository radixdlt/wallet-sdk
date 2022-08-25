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

const openExtension =
  (context: BrowserContext, extensionId: string) => async () => {
    let extension = await context.newPage()
    await extension.goto(`chrome-extension://${extensionId}/index.html`)
    return extension
  }

test('instantiate gumball component and buy 1 GUM', async ({
  extensionId,
  context,
}) => {
  const extensionOpener = openExtension(context, extensionId)
  const dApp = await context.newPage()

  await dApp.goto('http://localhost:5173')

  let extension = await extensionOpener()

  const createAccount = extension.locator(
    '#root > div.MuiBox-root.css-hlmef6 > div > div.MuiBox-root.css-1p021x2 > div > button'
  )
  await Promise.all([
    extension.waitForResponse(
      (resp) =>
        resp.url().includes('radixdlt.com/transaction') && resp.status() === 200
    ),
    createAccount.click(),
  ])

  await expect(extension.locator('text=No transactions found')).toHaveCount(1)

  await dApp.locator('#fetchAccountAddress').click()

  const accountAddress = await dApp.locator('#accountAddress').innerText()

  expect(accountAddress, 'Check account address').toBeDefined()

  await dApp.locator('input#packageFileInput').setInputFiles({
    name: 'gumball_machine.wasm',
    mimeType: 'text/plain',
    buffer: gumballWasm,
  })

  await dApp.locator('#publishPackage').click()

  extension = await extensionOpener()

  await Promise.all([
    extension.waitForResponse(
      (resp) =>
        resp.url().includes('radixdlt.com/transaction') && resp.status() === 200
    ),
    extension.locator('text=Submit').first().click(),
  ])

  await dApp.waitForSelector('#packageAddress')
  const packageAddress = await dApp.locator('#packageAddress').innerText()
  expect(packageAddress.length, 'Check package address').toBeGreaterThan(0)

  await dApp.locator('#instantiateComponent').click()

  await delayAsync(2000)

  extension = await extensionOpener()

  await Promise.all([
    extension.waitForResponse(
      (resp) =>
        resp.url().includes('radixdlt.com/transaction') && resp.status() === 200
    ),
    extension.locator('text=Submit').first().click(),
  ])

  await dApp.waitForSelector('#componentAddress')
  const componentAddress = await dApp.locator('#componentAddress').innerText()
  expect(componentAddress.length, 'Check component address').toBeGreaterThan(0)

  await dApp.locator('#buyGumball').click()

  await delayAsync(2000)

  extension = await extensionOpener()

  await Promise.all([
    extension.waitForResponse(
      (resp) =>
        resp.url().includes('radixdlt.com/transaction') && resp.status() === 200
    ),
    extension.locator('text=Submit').first().click(),
  ])

  await dApp.waitForSelector('#receipt')
  const receipt = await dApp.locator('#receipt').innerText()
  expect(receipt.length, 'Check receipt').toBeGreaterThan(0)

  await Promise.all([
    dApp.waitForResponse(
      (resp) =>
        resp.url().includes('radixdlt.com/component') && resp.status() === 200
    ),
    dApp.locator('#checkBalance').first().click(),
  ])

  await dApp.waitForSelector('#userBalance')
  const userBalance = await dApp.locator('#userBalance').innerText()
  expect(userBalance.length, 'Check user balance').toBeGreaterThan(0)

  await delayAsync(1000)
  const amount = await dApp.locator('#balance').innerText()

  expect(amount, 'Check balance').toBe(
    'I have 1 GUM, and the machine has 99 GUM.'
  )
})
