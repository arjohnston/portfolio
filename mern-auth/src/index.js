import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import 'normalize.css'
import './index.css'

ReactDOM.render(
  <Router>
    <div>
      <Route exact path='/' component={Dashboard} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </div>
  </Router>,
  document.getElementById('root')
)

registerServiceWorker()
