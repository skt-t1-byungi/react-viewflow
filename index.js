import { useEffect, useRef, useState } from 'react'

export default function viewflow(generator) {
    return function ViewflowComponent(props) {
        const aborter = (useRef().current ??= new AbortController())

        const controller = (useRef().current ??= {
            next(value) {
                setValue(iterator.next(value).value)
            },
            throw(error) {
                setValue(iterator.throw(error).value)
            },
            signal: aborter.signal,
            Await({ children, promise }) {
                useRef().current ??= promise.then(
                    controller.next,
                    controller.throw,
                )
                return render(children)
            },
            props,
        })
        controller.props = props

        const iterator = (useRef().current ??= generator(controller))
        const [value, setValue] = useState(() => iterator.next().value)

        useEffect(
            () => () => {
                aborter.abort()
                iterator.return()
            },
            [],
        )

        function render(result) {
            return typeof result === 'function'
                ? result(controller.props)
                : result
        }

        return render(value)
    }
}
