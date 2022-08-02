import { err, errAsync, ok, okAsync, ResultAsync } from "neverthrow"
import { ActionType, Payload, sendExtensionMessage } from "./messaging"
import { v4 as uuid } from "uuid"
import pipe from 'ramda/src/pipe'

// @ts-ignore
const isAvailable = () => window.radixBrowserExtensionEnabled ? ok(undefined) : err(Error('Browser extension not available'))

const connect = sendExtensionMessage(ActionType.Connect)

const requestInfo = sendExtensionMessage(ActionType.RequestInfo)

const requestProof = pipe(
    (addresses?: string[]) => ({
        addresses,
        nonce: uuid()
    }),
    sendExtensionMessage(ActionType.RequestProof),
    result => {
        // TODO
    }
)

export const Wallet = {
    isAvailable,
    connect,
    requestInfo,
    requestProof
}

