"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ClipboardList } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    const correctPassword = "task1234"
    if (password === correctPassword) {
      document.cookie = "auth=true; path=/"
      router.push("/")
    } else {
      setError("パスワードが正しくありません")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* アプリ名 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#FA6218] rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList size={30} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">TasksBoard</h1>
          <p className="text-sm text-gray-500 mt-1">パスワードを入力してください</p>
        </div>

        {/* パスワード入力 */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218] pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#FA6218] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  )
}