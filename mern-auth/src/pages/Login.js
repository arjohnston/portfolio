import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: '',
      message: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    let token = window.localStorage ? window.localStorage.getItem('jwtToken') : ''

    // Logout if token is present
    if (token) {
      window.localStorage.removeItem('jwtToken')
      window.location.reload()
    }
  }

  onChange (e) {
    let state = { ...this.state }
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit (e) {
    e.preventDefault()

    const { username, password } = this.state

    axios.post('/api/auth/login', { username, password })
      .then((result) => {
        window.localStorage.setItem('jwtToken', result.data.token)
        this.setState({ message: '' })
        this.props.history.push('/')
      })
      .catch((error) => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  render () {
    const { username, password, message } = this.state

    return (
      <div className='container'>
        <form onSubmit={this.onSubmit}>
          <h1>Welcome</h1>

          {message !== '' &&
            <span>
              { message }
            </span>
          }

          <input
            type='email'
            name='username'
            placeholder='Email'
            value={username}
            onChange={this.onChange}
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={this.onChange}
            required
          />

          <button type='submit'>Login</button>

          <p>
            Not registered? <Link to='/register'>Create an account</Link>
          </p>
        </form>
      </div>
    )
  }
}
