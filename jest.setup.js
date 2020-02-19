import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

window.alert = msg => {
  // console.log(msg)
}
window.matchMedia = () => ({})
window.scrollTo = () => {}

configure({ adapter: new Adapter() })
