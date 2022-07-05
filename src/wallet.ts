import { err, errAsync, ok, okAsync, ResultAsync } from "neverthrow"
import { ActionType, Payload, sendExtensionMessage } from "./messaging"

// @ts-ignore
const isAvailable = () => window.radixBrowserExtensionEnabled ? ok(undefined) : err(Error('Browser extension not available'))

const connect = () => ResultAsync.fromPromise(
    sendExtensionMessage(ActionType.Connect, undefined), (e: Error) => e
).andThen(
    response => response ? okAsync(response) : errAsync(Error('Wallet connection rejected'))
)

const requestInfo = (info: Payload<ActionType.RequestInfo>) => ResultAsync.fromPromise(
    sendExtensionMessage(ActionType.RequestInfo, info), (e: Error) => e
).andThen(
    response => response ? okAsync(response) : errAsync(Error('Info request rejected'))
)

const requestProof = (addresses: Payload<ActionType.RequestProof>) => ResultAsync.fromPromise(
    sendExtensionMessage(ActionType.RequestProof, addresses), (e: Error) => e
).andThen(
    response => response ? okAsync(response) : errAsync(Error('Proof request rejected'))
)

export const Wallet = {
    isAvailable,
    connect,
    request: requestInfo,
    requestProof
}

