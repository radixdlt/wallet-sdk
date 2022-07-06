import { err, errAsync, ok, okAsync, ResultAsync } from "neverthrow"
import { ActionType, Payload, sendExtensionMessage } from "./messaging"

// @ts-ignore
const isAvailable = () => window.radixBrowserExtensionEnabled ? ok(undefined) : err(Error('Browser extension not available'))

const connect = sendExtensionMessage(ActionType.Connect)

const requestInfo = sendExtensionMessage(ActionType.RequestInfo)

const requestProof = sendExtensionMessage(ActionType.RequestProof)

export const Wallet = {
    isAvailable,
    connect,
    request: requestInfo,
    requestProof
}

