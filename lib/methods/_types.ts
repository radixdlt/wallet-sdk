import { Request, Transaction } from '.'

export type MethodType = 'request' | 'transaction'

export type Methods = Request | Transaction
