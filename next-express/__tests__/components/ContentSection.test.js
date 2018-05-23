/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import {
  ContentSection,
  ContentSectionPane
} from '../../components/ContentSection/ContentSection.js'

describe('With Snapshot Testing', () => {
  it('should match its empty snapshot', () => {
    const component = renderer.create(<ContentSection />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with children', () => {
    const rendered = renderer.create(
      <ContentSection>
        <h1>child</h1>
      </ContentSection>
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with props', () => {
    const rendered = renderer.create(
      <ContentSection className='test' bgColor='#FFFFFF' />
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('should match its empty snapshot', () => {
    const component = renderer.create(<ContentSectionPane />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with children', () => {
    const rendered = renderer.create(
      <ContentSectionPane>
        <h1>child</h1>
      </ContentSectionPane>
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with props', () => {
    const rendered = renderer.create(<ContentSectionPane className='test' />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})

describe('With Enzyme: ', () => {
  it('calls testIfSearchBot on mount', async () => {
    const spy = jest.spyOn(ContentSection.prototype, 'testIfSearchBot')
    const wrapper = shallow(<ContentSection />)
    await wrapper.instance().componentDidMount

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockClear()
  })

  it('testIfSearchBot returns false if userbot not searchBot', () => {
    const wrapper = shallow(<ContentSection />)
    expect(wrapper.instance().testIfSearchBot()).toBe(false)
  })
})
