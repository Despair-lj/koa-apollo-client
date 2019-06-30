import React from 'react'

export const Login = {
  ok: false,
  isAdmin: false,
  username: ''
}

export const LoginContext = React.createContext({
  ok: Login.ok,
  isAdmin: Login.isAdmin,
  toggleLogin: () => {}
})
