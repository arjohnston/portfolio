import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAuthenticated: false
    }
  }

  componentDidMount () {
    let token = window.localStorage.getItem('jwtToken')

    // Immediately direct to /login if no jwtToken token present
    if (!token) {
      this.props.history.push('/login')
      return
    }

    // Verify if token is valid
    // As user persmissions are created, the verify auth should be more extensive
    // and return views as the permissions defines
    axios.post('/api/auth/verify', { token })
      .then(res => {
        this.setState({ isAuthenticated: true })
      })
      .catch(() => {
        this.props.history.push('/login')
      })
  }

  logout () {
    window.localStorage.removeItem('jwtToken')
    window.location.reload()
  }

  render () {
    return (
      this.state.isAuthenticated
        ? <div>
          <button onClick={this.logout}>Logout</button>
          <h1>Hello world</h1>
        </div>
        : ''
    )
  }
}
