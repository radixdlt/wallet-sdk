export enum ActionType {
  GetAccountAddress = 'getAccountAddress',
  GetAccountAddressSuccess = 'getAccountAddressSuccess',
  GetAccountAddressFailure = 'getAccountAddressFailure',

  SignTransaction = 'signTransaction',
  SignTransactionSuccess = 'signTransactionSuccess',
  SignTransactionFailure = 'signTransactionFailure',
}

export type Action<T extends ActionType, P> = {
  type: T
  payload: P
  id: string
}

export type GetAccountAddress = Action<ActionType.GetAccountAddress, string>
export type GetAccountAddressSuccess = Action<
  ActionType.GetAccountAddressSuccess,
  string
>
export type GetAccountAddressFailure = Action<
  ActionType.GetAccountAddressFailure,
  string
>

export type SignTransaction = Action<ActionType.SignTransaction, string>
export type SignTransactionSuccess = Action<
  ActionType.SignTransactionSuccess,
  Receipt
>
export type SignTransactionFailure = Action<
  ActionType.SignTransactionFailure,
  string
>

export type ActionTypes =
  | GetAccountAddress
  | GetAccountAddressSuccess
  | GetAccountAddressFailure
  | SignTransaction
  | SignTransactionSuccess
  | SignTransactionFailure

export type IncomingMessage =
  | Message<GetAccountAddressSuccess>
  | Message<GetAccountAddressFailure>
  | Message<SignTransactionSuccess>
  | Message<SignTransactionFailure>

export type OutgoingMessage =
  | Message<GetAccountAddress>
  | Message<SignTransaction>

export enum MessageTarget {
  Extension,
  Dapp,
}

export type Message<Action = ActionTypes> = {
  action: Action
  target: MessageTarget
}

/**
 *
 * @export
 * @interface Receipt
 */
export type Receipt = {
  /**
   *
   * @type {string}
   * @memberof Receipt
   */
  transactionHash: string
  /**
   *
   * @type {string}
   * @memberof Receipt
   */
  status: string
  /**
   *
   * @type {Array<string>}
   * @memberof Receipt
   */
  outputs: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Receipt
   */
  logs: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Receipt
   */
  newPackages: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Receipt
   */
  newComponents: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Receipt
   */
  newResources: Array<string>
}
