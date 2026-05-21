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

type StudyLog = {
  id: number;
  title: string;
  category: StudyCategory;
  minutes: number;
  studyDate: string;
  memo: string;
  createdAt: string;
};

type StudyLogListProps = {
  studyLogs: StudyLog[];
  editingLogId: number | null;
  editingTitle: string;
  editingCategory: StudyCategory;
  editingMinutes: string;
  editingStudyDate: string;
  editingMemo: string;
  categoryLabels: Record<StudyCategory, string>;
  setEditingTitle: (value: string) => void;
  setEditingCategory: (value: StudyCategory) => void;
  setEditingMinutes: (value: string) => void;
  setEditingStudyDate: (value: string) => void;
  setEditingMemo: (value: string) => void;
  handleStartEdit: (log: StudyLog) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDeleteStudyLog: (id: number) => void;
};

export default function StudyLogList({
  studyLogs,
  editingLogId,
  editingTitle,
  editingCategory,
  editingMinutes,
  editingStudyDate,
  editingMemo,
  categoryLabels,
  setEditingTitle,
  setEditingCategory,
  setEditingMinutes,
  setEditingStudyDate,
  setEditingMemo,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteStudyLog,
}: StudyLogListProps) {
  return (
    <section className="rounded-lg bg-slate-900 p-4">
      <h2 className="mb-4 text-xl font-bold">学習ログ一覧</h2>

      {studyLogs.length === 0 ? (
        <p className="text-slate-400">まだ学習ログがありません。</p>
      ) : (
        <ul className="space-y-2">
          {studyLogs.map((log) => (
            <li key={log.id} className="rounded-md bg-slate-800 p-3">
              {editingLogId === log.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
                  />

                  <select
                    value={editingCategory}
                    onChange={(e) =>
                      setEditingCategory(e.target.value as StudyCategory)
                    }
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
                    value={editingMinutes}
                    onChange={(e) => setEditingMinutes(e.target.value)}
                    className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
                  />

                  <input
                    type="date"
                    value={editingStudyDate}
                    onChange={(e) => setEditingStudyDate(e.target.value)}
                    className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
                  />

                  <textarea
                    value={editingMemo}
                    onChange={(e) => setEditingMemo(e.target.value)}
                    className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold hover:bg-blue-700"
                    >
                      保存
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="rounded-md bg-slate-600 px-3 py-1 text-sm font-bold hover:bg-slate-500"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{log.title}</div>

                    <div className="mt-1 text-sm text-slate-300">
                      カテゴリ：{categoryLabels[log.category]} / 学習時間：
                      {log.minutes}分 / 学習日：{log.studyDate}
                    </div>

                    {log.memo && (
                      <p className="mt-1 text-sm text-slate-400">
                        メモ：{log.memo}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(log)}
                      className="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold hover:bg-blue-700"
                    >
                      編集
                    </button>

                    <button
                      onClick={() => handleDeleteStudyLog(log.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-bold hover:bg-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}