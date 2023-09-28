import { FC, ReactNode, useEffect, useRef, useState } from 'react'

type ViewComponent<Props> = FC<Props> | ReactNode

export interface ViewflowController<Props extends {}> {
    next(value?: any): void
    throw(error?: any): void
    signal: AbortSignal
    props: Props
    Await({
        children,
        promise,
    }: {
        promise: Promise<any>
        children: ViewComponent<Props>
    }): ReactNode
}

export type ViewflowGenerator<Props extends {}> = (
    flow: ViewflowController<Props>,
) => Generator<ViewComponent<Props>, ReactNode>

export default function viewflow<
    Props extends {},
    F extends ViewflowGenerator<Props> = ViewflowGenerator<Props>,
>(generator: F) {
    return function ViewflowComponent(props: Props) {
        const aborter = useOnce(() => new AbortController())

        const controller: ViewflowController<Props> = useOnce(() => ({
            next(value) {
                setValue(iterator.next(value).value)
            },
            throw(error: any) {
                setValue(iterator.throw(error).value)
            },
            signal: aborter.signal,
            Await({ children, promise }) {
                useOnce(() => {
                    promise.then(controller.next, controller.throw)
                })
                return render(children)
            },
            props,
        }))
        controller.props = props

        const iterator = useOnce(() => generator(controller))
        const [value, setValue] = useState(() => iterator.next().value)

        useEffect(
            () => () => {
                aborter.abort()
                iterator.return(null)
            },
            [],
        )

        function render(result: ViewComponent<Props>) {
            return typeof result === 'function'
                ? result(controller.props)
                : result
        }

        return render(value)
    }
}

function useOnce<T>(fn: () => T): T {
    return (useRef<{ value: T }>().current ??= { value: fn() }).value
}
