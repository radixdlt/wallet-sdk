import { filter, firstValueFrom, map, ReplaySubject } from "rxjs"
import { v4 as uuid } from "uuid"
import { send, ActionType, Response } from "."

type ExtensionResponse<T extends ActionType> = CustomEvent<{
    id: string,
    type: T,
    response: Response<T>
}>

export const messages$ = new ReplaySubject<ExtensionResponse<ActionType>>()

window.addEventListener(
    "radix#chromeExtension#receive",
    (event: ExtensionResponse<ActionType>) => messages$.next(event)
)

export const sendExtensionMessage = send((type, payload) => {
    const id = uuid()

    window.dispatchEvent(new CustomEvent(`radix#chromeExtension#send`, { detail: { type, payload, id } }))

    return firstValueFrom(
        messages$.pipe(
            filter(event => event.detail.id === id),
            map(event => event.detail.response as Response<typeof type>),
        )
    )
})