import { ClipboardList } from "lucide-react"

import { LoginForm } from "../../components/login/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList size={30} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">TasksBoard</h1>
          <p className="text-sm text-gray-400 mt-1">パスワードを入力してください</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}