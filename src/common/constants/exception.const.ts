export type ExceptionType = keyof typeof ExceptionMessages

export const ExceptionMessages = {
  SUCCESS: {
    message: 'Request processed successfully.',
  },
  '000-400': {
    message:
      'Bad Request. The server could not understand the request due to invalid syntax.',
  },
  '000-401': {
    message:
      'Unauthorized. The client must authenticate itself to get the requested response',
  },
  ACCESS_DENIED: {
    message:
      'Forbidden. The client does not have access rights to the content, or directory listing is denied.',
  },
  REQUEST_EMPTY: {
    message: 'Request should be not empty',
  },
  AUTH_WRONG_PASSWORD: {
    message: 'Username or password incorrect',
  },
  ACCOUNT_LOCKED: {
    message: 'The account has been locked',
  },
  INVALID_DATA: {
    message: 'Invalid request. One or several input parameters are invalid.',
  },
  USER_EXISTED: {
    message: 'User already exists',
  },
}
