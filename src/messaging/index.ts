import { ResultAsync } from 'neverthrow'

export * from './extension'

export enum ActionType {
    Connect = 'connect',
    RequestInfo = 'requestInfo',
    RequestProof = 'requestProof'
}

export type Payload<T extends ActionType> =
    T extends ActionType.Connect ? undefined :
    T extends ActionType.RequestInfo ? {
        identity?: boolean,
        accounts?: 'any' | { reason: string, ongoing: boolean }[],
        credentials?: { type: string, ongoing: boolean }[]
    } :
    T extends ActionType.RequestProof ? {
        addresses?: string[],
        nonce: string
    } :
    never

export type Response<T extends ActionType> =
    T extends ActionType.Connect ? UserInfo :
    T extends ActionType.RequestInfo ? {
        accounts?: string[]
    } :
    never

type Account = {
    label: string,
    address: string
}

type UserInfo = {
    accounts?: Account[],
    profile?: Record<string, string>,
    identity?: string
}

export type SendMessage = <T extends ActionType>(type: T, payload: Payload<T>) => ResultAsync<Response<T>, Error>

export const send = (fn: SendMessage) => <T extends ActionType>(type: T) => (payload: Payload<T>) => fn(type, payload)