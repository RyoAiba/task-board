import { type Priority, type Task } from "../types"

const TASK_TITLES = {
  仕事: [
    "田中さんと1on1 14時",
    "採用面談（フロントエンド）",
    "9月リリースの仕様書レビュー",
    "山田さんに見積もり共有",
    "Slack通知設定の見直し",
    "ログイン画面のドキュメント整理",
    "月次レポート提出",
    "新人さんのコードレビュー",
    "経費精算（5月分）",
    "Figmaのコンポーネント命名統一",
    "API仕様書のレビュー",
    "セキュリティ研修受講",
    "スプリント振り返りの準備",
    "鈴木部長と中間報告MTG",
    "バックエンドのバグ調査",
    "田町オフィス出社",
  ],
  趣味: [
    "駒沢公園でランニング",
    "中目黒スタバで読書",
    "Netflixで沈黙の艦隊の続き",
    "ブログ「Reactの再レンダリング」執筆",
    "ジムでベンチプレス",
    "自由が丘のヴィレッジヴァンガード",
    "二子玉川を散歩",
    "渋谷シネクイントで映画",
    "朝ヨガ（YouTube）",
    "お気に入りカフェで作業",
    "三軒茶屋の銭湯",
    "蔦屋書店代官山で本探す",
    "ギター練習（オアシス）",
    "中目黒で桜の写真撮影",
    "学芸大学のラーメン屋開拓",
  ],
  その他: [
    "三軒茶屋のスーパーで買い物",
    "恵比寿の歯医者予約",
    "自由が丘のドンキで日用品",
    "ふるさと納税の手続き",
    "クリーニング受け取り",
    "渋谷ロフトで文房具",
    "銀行で振込",
    "部屋の掃除機がけ",
    "観葉植物に水やり",
    "アマプラ解約検討",
    "中目黒の郵便局で書留",
    "Suicaチャージ",
    "ユニクロ自由が丘で部屋着",
    "美容院予約",
    "健康診断の予約",
  ],
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export function generateDummyTasks(): Task[] {
  const tasks: Task[] = []
  const now = new Date()
  let taskId = 1

  // 期限のバリエーション（過去2週間〜未来1ヶ月、約2割が期限なし）
  const dueDatePatterns: (Date | undefined)[] = [
    addDays(now, -14),
    addDays(now, -7),
    addDays(now, -3),
    addDays(now, -1),
    now,
    now,
    addDays(now, 1),
    addDays(now, 2),
    addDays(now, 3),
    addDays(now, 7),
    addDays(now, 14),
    addDays(now, 30),
    undefined,
    undefined,
    undefined,
  ]

  // 優先度パターン（高:中:低:なし ≒ 2:4:2:3 くらい）
  const priorityPatterns: (Priority | undefined)[] = [
    "high",
    "high",
    "medium",
    "medium",
    "medium",
    "medium",
    "low",
    "low",
    undefined,
    undefined,
    undefined,
  ]

  Object.entries(TASK_TITLES).forEach(([labelName, titles], labelIndex) => {
    const labelId =
      labelName === "仕事" ? "cat_1" : labelName === "趣味" ? "cat_2" : "cat_3"

    titles.forEach((title, index) => {
      const daysAgo = Math.floor(Math.random() * 14)
      const createdDate = new Date(now)
      createdDate.setDate(createdDate.getDate() - daysAgo)

      // ラベルごとにパターンをずらして同じ並びにならないように
      const dueDate = dueDatePatterns[(index + labelIndex) % dueDatePatterns.length]
      const priority = priorityPatterns[(index + labelIndex * 2) % priorityPatterns.length]
      const completed = Math.random() < 0.3

      tasks.push({
        id: `task_${taskId++}`,
        title,
        priority,
        labelId,
        completed,
        createdAt: createdDate.toISOString(),
        dueDate: dueDate ? formatDate(dueDate) : undefined,
      })
    })
  })

  return tasks
}