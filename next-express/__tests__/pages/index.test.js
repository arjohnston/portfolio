/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import App from '../../pages/index.js'

describe('With Snapshot Testing', () => {
  it('should match its empty snapshot', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('With Enzyme: ', () => {
  it('should toggle video when clicked', () => {
    const spy = jest.spyOn(App.prototype, 'handleVideoToggle')
    const wrapper = shallow(<App />)

    wrapper.find('.play-button').simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.state('videoOpen')).toBe(true)
    spy.mockClear()

    wrapper
      .find('Video')
      .dive()
      .find('.video-close-button')
      .simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.state('videoOpen')).toBe(false)
    spy.mockClear()
  })
})
