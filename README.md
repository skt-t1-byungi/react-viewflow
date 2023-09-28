# react-viewflow

> Work in progress

A robust React component library for effortlessly managing complex view flows.

## Example

```jsx
const PageFlow = viewflow(function* (flow) {
    while (true) {
        yield <Page1 onNext={() => flow.next()} />

        try {
            const result = yield (
                <Page2
                    onNext={() => flow.next(true)}
                    onBack={() => flow.next()}
                    onError={() => flow.throw()}
                />
            )

            if (result) break
        } catch {
            return <ErrorPage />
        }
    }

    return <SuccessPage />
})
```
