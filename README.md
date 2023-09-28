# react-viewflow

> Work in progress

A React component library for managing complex view flows

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
