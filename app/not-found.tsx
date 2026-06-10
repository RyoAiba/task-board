import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-2 pb-8">
      <h1 className="text-[120px] font-bold text-brand-400">
        404
      </h1>

      <p className="text-lg font-semibold text-gray-800 mb-2">
        ページが見つかりませんでした。
      </p>

      <p className="text-sm text-gray-500 mb-6">
        URLが変更されたか、削除された可能性があります。
      </p>

      <Link
        href="/"
        className="bg-brand-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
      >
        ダッシュボードへ戻る
      </Link>
    </div>
  )
}