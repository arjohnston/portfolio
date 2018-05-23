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

  it('renders correctly with props', () => {
    const rendered = renderer.create(
      <Header themeColor='#FFFFFF' sendState={() => {}} />
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with cust. page', () => {
    const rendered = renderer.create(
      <Header
        themeColor='#FFFFFF'
        sendState={() => {}}
        customerPage
        customerPageLogo={'/image.png'}
      />
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})

describe('With Enzyme: ', () => {
  it('clicking mobile menu opens the menu', () => {
    const spy = jest.spyOn(Header.prototype, 'handleMobileToggle')
    const wrapper = shallow(<Header />)

    expect(spy).toHaveBeenCalledTimes(0)
    wrapper.find('.mobile-menu-button').simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockClear()
  })

  it('clicking search icon opens the search bar', () => {
    const spy = jest.spyOn(Header.prototype, 'toggleSearchBarOpen')
    const wrapper = shallow(<Header />)

    expect(spy).toHaveBeenCalledTimes(0)
    wrapper
      .find('.search.button-wrapper')
      .at(0)
      .simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockClear()
  })

  it('clicking submit calls handleSubmit', () => {
    const spy = jest.spyOn(Header.prototype, 'handleSubmit')
    const wrapper = shallow(<Header />)

    expect(spy).toHaveBeenCalledTimes(0)
    wrapper.setState({ searchBarOpen: true })
    wrapper
      .find('.search.button-wrapper')
      .at(0)
      .simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockClear()
  })

  it('typing in input calls handleKeyPress', () => {
    const spyKeyPress = jest.spyOn(Header.prototype, 'handleKeyPress')
    const wrapper = shallow(<Header />)
    const ENTER_KEY_CODE = 13

    expect(spyKeyPress).toHaveBeenCalledTimes(0)
    wrapper
      .find('input[type="search"]')
      .at(0)
      .simulate('keyPress', { keyCode: ENTER_KEY_CODE })
    expect(spyKeyPress).toHaveBeenCalledTimes(1)

    spyKeyPress.mockClear()
  })
})
