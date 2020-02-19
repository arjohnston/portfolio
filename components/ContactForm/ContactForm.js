/* global fetch:false */

import React from 'react'
import PropTypes from 'prop-types'
import ReCAPTCHA from 'react-google-recaptcha'
import './style.css'
const api = require('../../config/api')

require('es6-promise').polyfill()
require('isomorphic-fetch')
const DEV = process.env.NODE_ENV !== 'production'

export default class ContactForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      submitted: false,
      submittedSuccess: false,
      formFields: {
        recaptcha: {
          isRequired: true,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        message: {
          isRequired: true,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        firstname: {
          isRequired: true,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        lastname: {
          isRequired: true,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        email: {
          isRequired: true,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        phone: {
          isRequired: false,
          isValid: false,
          class: '',
          error: '',
          value: ''
        },
        selectContact: {
          isShown: false,
          isRequired: false,
          isValid: false,
          class: '',
          error: '',
          value: ''
        }
      }
    }
  }

  onChange (value) {
    const form = { ...this.state.formFields }
    form.recaptcha.value = value !== null ? value : ''

    this.setState(
      {
        formFields: form
      },
      () => {
        if (value !== null || value !== '') {
          this.validateRecaptcha()
        }
      }
    )
  }

  validate (input) {
    const form = { ...this.state.formFields }
    const success = 'form-input-success'
    const failure = 'form-input-fail'
    const el = document.getElementById('form-' + input)
    let value = el ? el.value : ''

    if (input === 'selectContact') value = form.selectContact.value

    const checkForValidation = this.validateInput(value, input)

    if (
      checkForValidation === true &&
      (value.length > 0 || form[input].isRequired === false)
    ) {
      form[input].class = success
      form[input].isValid = true
      form[input].error = ''

      if (input !== 'recaptcha') form[input].value = value
    } else if (checkForValidation === false) {
      if (form[input].isRequired === false && value === '') {
        form[input].isValid = true
        form[input].value = value
      } else if (value === '') {
        form[input].value = ''
        form[input].isValid = false
      } else {
        form[input].value = value
        form[input].isValid = false
      }

      form[input].class = ''
      form[input].error = ''
    } else if (typeof checkForValidation === 'string') {
      form[input].class = failure
      form[input].isValid = false
      form[input].error = checkForValidation
      form[input].value = value
    }

    if (
      !form.selectContact.isShown &&
      form.email.isValid &&
      form.phone.isValid &&
      form.phone.value !== ''
    ) {
      form.selectContact.isShown = true
      form.selectContact.isRequired = true
    } else if (
      form.selectContact.isShown &&
      (!form.email.isValid || !form.phone.isValid || form.phone.value === '')
    ) {
      form.selectContact.isShown = false
    }

    this.setState({
      formFields: form
    })
  }

  validateInput (value, type) {
    let validated = false
    const htmlRegex = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i
    const phoneRegex = /^[+]*(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-./]?)?((?:\(?\d{1,}\)?[-. /]?){0,})(?:[-./]?(?:#|ext\.?|extension|x)[-. /]?(\d+))?$/i
    const emailRegex = /^.+@.+\..+$/

    const contact = {
      error: {
        required: '*Required',
        html: 'No HTML Allowed',
        message: {
          minimum: 'At least 10 characters minimum.'
        },
        email: 'Invalid Email Address',
        phone: 'Invalid Phone Number',
        radio: 'Please choose the preferred method of communication'
      }
    }

    if (value !== '') {
      if (htmlRegex.test(value)) {
        return contact.error.html
      }
    }

    switch (type) {
      case 'recaptcha':
        if (this.state.formFields.recaptcha.value === '') {
          validated = contact.error.required
        } else {
          validated = true
        }
        break

      case 'firstname':
      case 'lastname':
        if (
          this.state.submitted &&
          value === '' &&
          this.state.formFields[type].isRequired
        ) {
          validated = contact.error.required
        } else if (value.length >= 1) {
          validated = true
        }
        break

      case 'email':
        if (
          this.state.submitted &&
          value === '' &&
          this.state.formFields[type].isRequired
        ) {
          validated = contact.error.required
        } else if (value === '') {
          validated = false
        } else if (emailRegex.test(value)) {
          validated = true
        } else {
          validated = contact.error.email
        }
        break

      case 'phone':
        if (value === '') {
          validated = false
        } else if (phoneRegex.test(value)) {
          validated = true
        } else {
          validated = contact.error.phone
        }
        break

      case 'message':
        if (this.state.submitted && value === '') {
          validated = contact.error.required
        } else if (value.length >= 10) {
          validated = true
        } else if (value.length > 0 && value.length < 10) {
          validated = contact.error.message.minimum
        }

        break

      case 'selectContact':
        if (this.state.formFields[type].isShown === false) {
          validated = true
        } else if (
          this.state.submitted &&
          this.state.formFields[type].value === '' &&
          this.state.formFields[type].isRequired
        ) {
          validated = contact.error.required
        } else if (this.state.formFields[type].value === '') {
          validated = contact.error.radio
        } else if (this.state.formFields[type].value.length > 0) {
          validated = true
        }
        break
    }

    return validated
  }

  handleSelectOption (type) {
    const form = { ...this.state.formFields }
    form.selectContact.value = type

    this.setState({
      formFields: form
    })
  }

  handleSubmit (e) {
    if (e) e.preventDefault()

    this.setState(
      {
        submitted: true
      },
      function () {
        // These need to be async
        this.validate('message')
        this.validate('firstname')
        this.validate('lastname')
        this.validate('email')
        this.validate('phone')
        this.validate('selectContact')
        this.validateRecaptcha()

        const form = { ...this.state.formFields }

        if (
          form.message.isValid &&
          form.firstname.isValid &&
          form.lastname.isValid &&
          form.email.isValid &&
          form.phone.isValid &&
          form.selectContact.isValid &&
          form.recaptcha.isValid
        ) {
          this.postData()
          window.scrollTo(0, 0)
        } else {
          if (process.env.NODE_ENV !== 'test') console.log(form)
        }
      }
    )
  }

  validateRecaptcha () {
    if (DEV) {
      const form = { ...this.state.formFields }
      form.recaptcha.isValid = true
      this.setState({
        form: form
      })
      return
    }

    if (this.state.formFields.recaptcha.value !== '') {
      fetch('/api/recaptcha', {
        method: 'POST',
        body: JSON.stringify({ key: this.state.formFields.recaptcha.value }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return response.json()
          } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
          }
        })
        .then(data => {
          if (data.result) {
            const form = { ...this.state.formFields }
            form.recaptcha.isValid = true
            this.setState({
              form: form
            })
          }
        })
        .catch(err => console.log('Validate Recaptcha error: ', err))
    }
  }

  postData () {
    const form = { ...this.state.formFields }
    const data = {
      message: form.message.value,
      name: form.firstname.value + ' ' + form.lastname.value,
      email: form.email.value,
      phone: form.phone.value,
      contactType: form.selectContact.value
    }

    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      // .then(() => {
      //   this.setState({
      //     submittedSuccess: true
      //   })
      // })
      .catch(err => {
        if (DEV) {
          this.setState(
            {
              submittedSuccess: true
            },
            () => console.log('DEV: ', form)
          )
        } else {
          window.alert(
            'This page is experiencing a problem processing your information.'
          )
          console.log('Contact Form Submission Error: ', err)
        }
      })

    this.setState({
      submittedSuccess: true
    })
  }

  render () {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <form
          className={`form-800 ${
            !this.state.submittedSuccess ? 'form-800-is-shown' : ''
          }`}
        >
          <div className='form-input-wrapper full' style={{ display: 'flex' }}>
            <textarea
              type='text'
              name='message'
              placeholder={`${
                this.state.formFields.message.isRequired ? '*' : ''
              }${'How may we help you?'}`}
              id='form-message'
              onBlur={this.validate.bind(this, 'message')}
            />
            <span className='form-input-message'>
              {this.state.formFields.message.error}
            </span>
          </div>
          <div
            className={`form-input-wrapper ${this.state.formFields.firstname.class}`}
          >
            <input
              type='text'
              name='firstname'
              onBlur={this.validate.bind(this, 'firstname')}
              id='form-firstname'
            />
            <div className='form-input-validation' />
            <span
              className={`form-input-placeholder ${
                this.state.formFields.firstname.value !== '' ? 'has-text' : ''
              }`}
            >
              {this.state.formFields.firstname.isRequired ? '*' : ''}
              First Name
            </span>
            <span className='form-input-message'>
              {this.state.formFields.firstname.error}
            </span>
          </div>
          <div
            className={`form-input-wrapper ${this.state.formFields.lastname.class}`}
          >
            <input
              type='text'
              name='lastname'
              onBlur={this.validate.bind(this, 'lastname')}
              id='form-lastname'
            />
            <div className='form-input-validation' />
            <span
              className={`form-input-placeholder ${
                this.state.formFields.lastname.value !== '' ? 'has-text' : ''
              }`}
            >
              {this.state.formFields.lastname.isRequired ? '*' : ''}
              Last Name
            </span>
            <span className='form-input-message'>
              {this.state.formFields.lastname.error}
            </span>
          </div>
          <div
            className={`form-input-wrapper ${this.state.formFields.email.class}`}
          >
            <input
              type='email'
              name='email'
              onBlur={this.validate.bind(this, 'email')}
              id='form-email'
            />
            <div className='form-input-validation' />
            <span
              className={`form-input-placeholder ${
                this.state.formFields.email.value !== '' ? 'has-text' : ''
              }`}
            >
              {this.state.formFields.email.isRequired ? '*' : ''}
              Email
            </span>
            <span className='form-input-message'>
              {this.state.formFields.email.error}
            </span>
          </div>
          <div
            className={`form-input-wrapper ${this.state.formFields.phone.class}`}
          >
            <input
              type='tel'
              name='phone'
              onBlur={this.validate.bind(this, 'phone')}
              id='form-phone'
            />
            <div className='form-input-validation' />
            <span
              className={`form-input-placeholder ${
                this.state.formFields.phone.value !== '' ? 'has-text' : ''
              }`}
            >
              {this.state.formFields.phone.isRequired ? '*' : ''}
              Phone
            </span>
            <span className='form-input-message'>
              {this.state.formFields.phone.error}
            </span>
          </div>

          <div
            className={`form-input-wrapper ${
              this.state.formFields.selectContact.isShown
                ? 'is-open'
                : 'is-closed'
            }`}
          >
            <span style={{ marginBottom: '6px' }}>
              {this.state.formFields.selectContact.isRequired ? '*' : ''}
              Contact Preference
            </span>
            <div>
              <input
                name='contact'
                id='email'
                type='radio'
                value='email'
                onChange={this.handleSelectOption.bind(this, 'email')}
              />
              <label htmlFor='email'>Please reply to my email address</label>
            </div>
            <div>
              <input
                name='contact'
                id='phone'
                type='radio'
                value='phone'
                onChange={this.handleSelectOption.bind(this, 'phone')}
              />
              <label htmlFor='phone'>Please reply by phone</label>
            </div>
            <span className='form-input-message'>
              {this.state.formFields.selectContact.error}
            </span>
          </div>

          {!DEV && (
            <div className='form-recaptcha'>
              <div style={{ overflow: 'hidden' }}>
                <ReCAPTCHA
                  ref='recaptcha'
                  sitekey={api.google.recaptcha.CLIENT_KEY}
                  onChange={this.onChange.bind(this)}
                />
                <span
                  style={{ width: '100%', textAlign: 'left', display: 'block' }}
                  className='form-input-message'
                >
                  {this.state.formFields.recaptcha.error}
                </span>
              </div>
            </div>
          )}

          <div className='form-submit-wrapper'>
            <input
              className='button button-submit'
              type='submit'
              value='Send'
              onClick={this.handleSubmit.bind(this)}
            />
          </div>
        </form>
        <div
          className={`form-submitted-success ${
            this.state.submittedSuccess ? 'form-submitted-success-is-shown' : ''
          }`}
        >
          <h3>Thank you {this.state.formFields.firstname.value}.</h3>
          <p>
            Your message has successfully been sent to Essential Hydration. You
            can expect to hear back from our team within 1-2 business days.
          </p>
        </div>
      </div>
    )
  }
}

ContactForm.propTypes = {
  requiredFields: PropTypes.object
}
