# Skill Growth Dashboard

## 概要

日々の学習内容と学習時間を記録し、学習時間を可視化するためのダッシュボードアプリです。

学習ログを登録すると、今日・今週・今月・合計の学習時間が自動で集計され、カテゴリ別の学習時間もステータスバーとして表示されます。

## 主な機能

- 学習ログ追加
- 学習ログ一覧表示
- 学習ログ削除
- 学習ログ編集
- 学習カテゴリ選択
- 学習時間の記録
- 学習日の記録
- メモ入力
- 今日の学習時間集計
- 今週の学習時間集計
- 今月の学習時間集計
- 合計学習時間集計
- カテゴリ別学習時間表示
- スキル別ステータスバー表示
- SupabaseによるDB保存

## 使用技術

- Next.js
- TypeScript
- React
- Tailwind CSS
- Supabase
- Git / GitHub

## 学習カテゴリ

- HTML / CSS
- JavaScript
- TypeScript
- React
- Next.js
- SQL
- Git / GitHub
- Excel
- その他

## 学習したこと

- useStateによる状態管理
- useEffectによるデータ取得
- map / filter / reduce を使った配列操作
- 今日 / 今週 / 今月の学習時間集計
- カテゴリ別集計
- TypeScriptの型定義
- Supabaseを使ったDB操作
- select / insert / update / delete
- async / await を使った非同期処理
- フォーム入力管理
- 編集状態の管理

## コンポーネント構成

```txt
app/
  page.tsx

components/
  StudyLogForm.tsx
  StudySummary.tsx
  SkillStatus.tsx
  StudyLogList.tsx

lib/
  supabase.ts