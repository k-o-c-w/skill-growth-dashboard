type StudyCategory =
  | "htmlCss"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "sql"
  | "git"
  | "excel"
  | "other";

type StudyLogFormProps = {
  title: string;
  category: StudyCategory;
  minutes: string;
  studyDate: string;
  memo: string;
  setTitle: (value: string) => void;
  setCategory: (value: StudyCategory) => void;
  setMinutes: (value: string) => void;
  setStudyDate: (value: string) => void;
  setMemo: (value: string) => void;
  handleAddStudyLog: () => void;
};

export default function StudyLogForm({
  title,
  category,
  minutes,
  studyDate,
  memo,
  setTitle,
  setCategory,
  setMinutes,
  setStudyDate,
  setMemo,
  handleAddStudyLog,
}: StudyLogFormProps) {
  return (
    <section className="mb-6 rounded-lg bg-slate-900 p-4">
      <h2 className="mb-4 text-xl font-bold">学習ログ追加</h2>

      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：Reactのpropsを復習する"
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as StudyCategory)}
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        >
          <option value="htmlCss">HTML / CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="react">React</option>
          <option value="nextjs">Next.js</option>
          <option value="sql">SQL</option>
          <option value="git">Git / GitHub</option>
          <option value="excel">Excel</option>
          <option value="other">その他</option>
        </select>

        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="学習時間（分）"
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        />

        <input
          type="date"
          value={studyDate}
          onChange={(e) => setStudyDate(e.target.value)}
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        />

        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="学習メモ"
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        />

        <button
          onClick={handleAddStudyLog}
          className="w-full rounded-md bg-purple-600 px-4 py-2 font-bold hover:bg-purple-700"
        >
          学習ログを追加
        </button>
      </div>
    </section>
  );
}