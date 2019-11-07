
const TokenKey = 'bufan'

export function getToken() {
  const token = window.localStorage.getItem(TokenKey)
  if(token == "" || token == undefined){
      return null
  }else{
      return JSON.parse(token)
  }
}

export function setToken(token) {
    window.localStorage.setItem(TokenKey,token)
}

export function removeToken() {
    window.localStorage.clear(TokenKey)
}
