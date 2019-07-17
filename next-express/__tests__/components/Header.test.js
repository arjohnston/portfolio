/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import Header from '../../components/Header/Header.js'

describe('With Snapshot Testing', () => {
  it('should match its empty snapshot', () => {
    const component = renderer.create(<Header />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

describe('With Enzyme: ', () => {})
