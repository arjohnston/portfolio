// Format the text of a message to be outputed into a terminal (tested on MacOS iTerm2)
// @parameter msg: string
// @parameter type: string (success, warn, error)
// @return: String
module.exports = (msg, type) => {
  const RED_TEXT = '\x1b[31m'
  const GREEN_TEXT = '\x1b[32m'
  const YELLOW_TEXT = '\x1b[33m'
  const RESET_TEXT = '\x1b[0m' // Reset is required to return the text color back to normal
  const CHECK_MARK = '\u2714'
  const CROSS = '\u274c'

  switch (type) {
    case 'success':
    case undefined:
      // String with a check mark and green text
      return `${GREEN_TEXT}${type ? CHECK_MARK + ' ' : ''}${msg}${RESET_TEXT}`

    case 'checkmark':
      // String with a check mark and green text
      return `${GREEN_TEXT}${CHECK_MARK}${RESET_TEXT}`

    case 'warn':
      // String with yellow text
      return `${YELLOW_TEXT}${msg}${RESET_TEXT}`

    case 'error':
      // String with cross and red text
      return `${RED_TEXT}${CROSS}  ${msg}${RESET_TEXT}`

    default:
      // Return the default string if unknown
      return msg
  }
}
