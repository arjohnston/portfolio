/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import App from '../App'

describe('With Snapshot Testing', () => {
  it('should match its empty snapshot', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
