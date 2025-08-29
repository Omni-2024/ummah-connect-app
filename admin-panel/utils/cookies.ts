interface CookieOptions {
  maxAge?: number // in seconds
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  if (typeof document === "undefined") return

  const { maxAge, path = "/", domain, secure = process.env.NODE_ENV === "production", sameSite = "lax" } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (maxAge !== undefined) {
    cookieString += `; Max-Age=${maxAge}`
  }

  cookieString += `; Path=${path}`

  if (domain) {
    cookieString += `; Domain=${domain}`
  }

  if (secure) {
    cookieString += "; Secure"
  }

  cookieString += `; SameSite=${sameSite}`

  document.cookie = cookieString
}

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(";")

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }

  return null
}

export const deleteCookie = (name: string, path = "/") => {
  if (typeof document === "undefined") return

  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
