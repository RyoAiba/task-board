# TasksBoard - 仕様書

## プロジェクト概要
個人利用向けタスク管理アプリ。

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- localStorage（データ永続化）

## 画面構成
- `/login` ログイン（パスワード認証）
- `/` ダッシュボード
- `/tasks` タスク一覧（全件・カテゴリ・優先度絞り込みはクエリパラメータ）
- `/tasks/new` タスク作成
- `/tasks/[id]` タスク詳細・編集
- `/settings` 設定

## ナビゲーション構成
### PCサイドバー
- 背景色: 白
- 文字色: グレー（text-gray-600）
- ホバー時: text-primary
- 右側にシャドウ

上部
- アイコン＋「ホーム」→ / へのリンク
- アイコン＋「新規作成」→ /tasks/new へのリンク
- アイコン＋「タスク一覧」→ /tasks へのリンク
  - 仕事（/tasks?category=cat_1）
  - 趣味（/tasks?category=cat_2）
  - その他（/tasks?category=cat_3）

下部
- 設定（/settings）
- ログアウト → クリックで LogoutModal を表示 → ログアウト（/login に戻る）

### スマホボトムナビ
- 背景色: 白
- 文字色: グレー（text-gray-500）
- ホバー時: text-primary
- 上部にシャドウ
- 5項目構成
  - ホーム（/）
  - タスク（/tasks）
  - ＋新規作成（/tasks/new）中央に大きめの丸ボタン（bg-primary）
  - 設定（/settings）
  - ログアウト → タップで LogoutModal を表示

## タスク一覧（/tasks）機能仕様
### フィルタ
- 検索: タイトル部分一致
- カテゴリ: ドロップダウンで複数選択（未選択時は全件表示）
- 優先度: チェックボックスで複数選択（未選択時は全件表示）
- ステータス: チェックボックスで複数選択（未選択時は全件表示）
- フィルタバーはスクロール時に上部固定（sticky）、横幅いっぱいに表示しボーダーで境界を表現

### ソート
- 並び替えドロップダウン（単一軸・複合ソートなし）
- カテゴリ昇順/降順（Category.order 基準）
- 優先度 高い順/低い順
- 未完了を先に/完了済を先に

### ページネーション
- 上下両方に表示
- デフォルト10件表示、30件に切り替え可能
- フィルタ・ソート・検索変更時はページ1にリセット

## タスク作成（/tasks/new）・タスク詳細・編集（/tasks/[id]）共通
- タスク名は必須（空文字不可）、最大50文字
- カテゴリは必須
- バリデーションエラーはフィールド直下に赤文字で表示
- タスク名入力欄には文字数カウンター表示（現在文字数 / 50）
- カテゴリはドロップダウン形式のセレクター（CategorySelector）で選択

## タスク詳細・編集（/tasks/[id]）
- キャンセルボタン押下で router.back()（遷移元に戻る）
- 保存後も router.back()

## データ設計
型定義の詳細は `types/index.ts` を参照。

## 設計方針
- データの読み書きは useTasks() カスタムフックに集約する
- カテゴリデータも useCategories() カスタムフックで管理する
- カテゴリ・優先度の表示名は const 定義から引く（直接文字列を書かない）
- 将来の機能追加を考慮した拡張しやすい設計にする
- コンポーネントは適切に分割する

## コーディング規約
- コンポーネントファイルは PascalCase（TaskCard.tsx）
- 型定義は types/index.ts に集約
- カスタムフックは hooks/ に配置
- コンポーネントは components/ に配置
- eslint-disable コメントを使わない（ESLintルール自体を eslint.config.mjs で調整する）

## やってはいけないこと
- any 型の使用禁止
- カテゴリ・優先度の表示名をハードコードしない
- ロジックをページコンポーネントに直接書かない
- インラインスタイルは使わない（style プロパティ禁止、Tailwind を使う）
- `<a>` タグを使わない（Next.js の Link コンポーネントを使う）

## デザイン
- テーマカラー: #FA6218
- 白ベースのモダンなUI
- レスポンシブ対応必須（モバイルファースト）
- フォント: Noto Sans JP（Google Fonts）

### フォントサイズ
- ページタイトル: 20px / font-bold
- セクションタイトル: 16px / font-semibold
- 本文: 14px / font-normal
- 補足・ラベル: 12px / font-normal
- バッジ・タグ: 12px / font-medium

### 行間
- 本文: leading-relaxed（1.625）
- 見出し: leading-snug（1.375）

### 優先度カラー
- 高: bg-red-100 text-red-600（ドット: bg-red-500）
- 中: bg-amber-100 text-amber-600（ドット: bg-amber-500）
- 低: bg-green-100 text-green-600（ドット: bg-green-500）

### カテゴリカラー
- blue / violet / slate / pink / teal / cyan の6色
- バッジ: CATEGORY_BADGE_CLASSES、ドット: CATEGORY_DOT_CLASSES（types/index.ts 参照）

## 実装済みコンポーネント
- components/BottomNav.tsx
- components/CategoryModal.tsx
- components/CategorySelector.tsx
- components/CheckboxGroup.tsx
- components/LayoutWrapper.tsx
- components/LogoutModal.tsx
- components/Pagination.tsx
- components/PrioritySelector.tsx
- components/Sidebar.tsx
- components/TaskCard.tsx

## カスタムフック構成
- hooks/useTasks.ts        タスクのCRUD・localStorage管理
- hooks/useCategories.tsx  カテゴリのCRUD・localStorage管理・Contextプロバイダー

## 実装後に必ず行うこと
- TypeScript の型エラーがないか確認（npx tsc --noEmit）
- ESLint エラーがないか確認（npm run lint）
- インラインスタイルが使われていないか確認
- `<a>` タグが使われていないか確認
- エラーや違反があれば自分で修正してから完了報告する