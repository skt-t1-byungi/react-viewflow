import 'global-jsdom/register'

import { render, screen } from '@testing-library/react'
import React from 'react'
import viewflow from '.'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

test('render', () => {
    const Test = viewflow(function* (flow) {
        yield <div onClick={flow.next}>test</div>
    })
    render(<Test />)
    assert.ok(screen.getByText('test'))
})

test.run()
