const AUTH_COOKIE = "auth"
const APP_PASSWORD = "task1234"
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7日

export function login(password: string): boolean {
  if (password !== APP_PASSWORD) return false
  document.cookie = `${AUTH_COOKIE}=true; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`
  return true
}

export function logout(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}