import { Task, Priority, PRIORITY_LABELS } from "../types"

const TASK_TITLES = {
  仕事: [
    "企画書を作成する",
    "クライアント会議の準備",
    "レポート作成",
    "メール対応",
    "プレゼンテーション資料作成",
    "バグ修正",
    "コードレビュー",
    "ドキュメント更新",
    "営業資料準備",
    "市場分析レポート",
    "契約書確認",
    "チームミーティング参加",
    "提案書作成",
    "データ分析",
    "システムアップデート",
  ],
  趣味: [
    "ジョギング",
    "読書（技術書）",
    "ブログ記事を書く",
    "ゲームをプレイ",
    "YouTubeを観る",
    "写真撮影",
    "料理を作る",
    "映画鑑賞",
    "運動する",
    "瞑想",
    "ギター練習",
    "イラスト描く",
    "散歩",
    "音楽鑑賞",
    "旅行計画",
  ],
  その他: [
    "買い物に行く",
    "部屋の掃除",
    "洗濯をする",
    "病院予約",
    "銀行に行く",
    "床掃除",
    "冷蔵庫整理",
    "請求書確認",
    "パソコン整理",
    "靴の修理",
    "ガス代支払い",
    "髪切る",
    "車の点検",
    "荷物整理",
    "植物に水やり",
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

  const dueDatePatterns = [
    addDays(now, -3),
    addDays(now, -1),
    now,
    addDays(now, 1),
    addDays(now, 3),
    addDays(now, 7),
    addDays(now, 14),
    undefined,
    undefined,
    undefined,
  ]

  const priorities = Object.keys(PRIORITY_LABELS) as Priority[]

  Object.entries(TASK_TITLES).forEach(([categoryName, titles]) => {
    const categoryId =
      categoryName === "仕事" ? "cat_1" : categoryName === "趣味" ? "cat_2" : "cat_3"

    titles.forEach((title, index) => {
      const daysAgo = Math.floor(Math.random() * 5)
      const createdDate = new Date(now)
      createdDate.setDate(createdDate.getDate() - daysAgo)

      const priority = priorities[index % priorities.length]
      const completed = Math.random() < 0.4
      const dueDateBase = dueDatePatterns[index % dueDatePatterns.length]

      tasks.push({
        id: `task_${taskId++}`,
        title,
        priority,
        categoryId,
        completed,
        createdAt: createdDate.toISOString(),
        dueDate: dueDateBase ? formatDate(dueDateBase) : undefined,
      })
    })
  })

  return tasks
}