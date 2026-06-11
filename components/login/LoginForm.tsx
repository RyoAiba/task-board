"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { login } from "../../utils/auth"

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (login(password)) {
      router.push("/")
    } else {
      setError("パスワードが正しくありません")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            setError("")
          }}
          onKeyDown={handleKeyDown}
          placeholder="パスワード"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={handleLogin}
        className="w-full py-3 bg-brand-500 text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
      >
        ログイン
      </button>
    </div>
  )
}