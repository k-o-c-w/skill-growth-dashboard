"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
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
    id: string;
    title: string;
    category: StudyCategory;
    minutes: number;
    studyDate: string;
    memo: string;
    createdAt: string;
  };

  const categoryLabels: Record<StudyCategory, string> = {
    htmlCss: "HTML / CSS",
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    nextjs: "Next.js",
    sql: "SQL",
    git: "Git / GitHub",
    excel: "Excel",
    other: "その他",
  };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudyCategory>("react");
  const [minutes, setMinutes] = useState("");
  const [studyDate, setStudyDate] = useState("");
  const [memo, setMemo] = useState("");
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<StudyCategory>("react");
  const [editingMinutes, setEditingMinutes] = useState("");
  const [editingStudyDate, setEditingStudyDate] = useState("");
  const [editingMemo, setEditingMemo] = useState("");

  useEffect(() => {
    const fetchStudyLogs = async () => {
      const { data, error } = await supabase
        .from("study_logs")
        .select("*")
        .order("study_date", { ascending: true });

      if (error) {
        console.error("Supabaseから学習ログの取得に失敗しました", error);
        return;
      }

      const convertedLogs: StudyLog[] = (data ?? []).map((log) => ({
        id: log.id,
        title: log.title,
        category: log.category as StudyCategory,
        minutes: log.minutes,
        studyDate: log.study_date,
        memo: log.memo ?? "",
        createdAt: log.created_at,
      }));

      setStudyLogs(convertedLogs);
    };

    fetchStudyLogs();
  }, []);

  const handleAddStudyLog = async () => {
    if (title.trim() === "" || minutes.trim() === "" || studyDate === "") {
      return;
    }

    const { data, error } = await supabase
      .from("study_logs")
      .insert({
        title: title,
        category: category,
        minutes: Number(minutes),
        study_date: studyDate,
        memo: memo,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabaseへの学習ログ追加に失敗しました", error);
      return;
    }

    console.log("Supabaseに追加した学習ログ:", data);

    const newStudyLog: StudyLog = {
      id: crypto.randomUUID(),
      title: title,
      category: category,
      minutes: Number(minutes),
      studyDate: studyDate,
      memo: memo,
      createdAt: new Date().toISOString(),
    };

    setStudyLogs([...studyLogs, newStudyLog]);

    setTitle("");
    setCategory("react");
    setMinutes("");
    setStudyDate("");
    setMemo("");
  };

  const handleDeleteStudyLog = async (id: string) => {
    const { error } = await supabase.from("study_logs").delete().eq("id", id);

    if (error) {
      console.error("Supabaseから学習ログ削除に失敗しました", error);
      return;
    }

    const newStudyLogs = studyLogs.filter((log) => log.id !== id);

    setStudyLogs(newStudyLogs);
  };

  const handleStartEdit = (log: StudyLog) => {
    setEditingLogId(log.id);
    setEditingTitle(log.title);
    setEditingCategory(log.category);
    setEditingMinutes(String(log.minutes));
    setEditingStudyDate(log.studyDate);
    setEditingMemo(log.memo);
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditingTitle("");
    setEditingCategory("react");
    setEditingMinutes("");
    setEditingStudyDate("");
    setEditingMemo("");
  };

  const handleSaveEdit = async () => {
    if (
      editingLogId === null ||
      editingTitle.trim() === "" ||
      editingMinutes.trim() === "" ||
      editingStudyDate === ""
    ) {
      return;
    }

    const { data, error } = await supabase
      .from("study_logs")
      .update({
        title: editingTitle,
        category: editingCategory,
        minutes: Number(editingMinutes),
        study_date: editingStudyDate,
        memo: editingMemo,
      })
      .eq("id", editingLogId)
      .select()
      .single();

    if (error) {
      console.error("Supabaseへの学習ログ編集に失敗しました", error);
      return;
    }

    const updatedLog: StudyLog = {
      id: data.id,
      title: data.title,
      category: data.category as StudyCategory,
      minutes: data.minutes,
      studyDate: data.study_date,
      memo: data.memo ?? "",
      createdAt: data.created_at,
    };

    const newStudyLogs = studyLogs.map((log) => {
      if (log.id !== editingLogId) {
        return log;
      }

      return updatedLog;
    });

    setStudyLogs(newStudyLogs);

    setEditingLogId(null);
    setEditingTitle("");
    setEditingCategory("react");
    setEditingMinutes("");
    setEditingStudyDate("");
    setEditingMemo("");
  };

  const totalMinutes = studyLogs.reduce((sum, log) => sum + log.minutes, 0);
  const today = new Date().toISOString().slice(0, 10);

  const todayMinutes = studyLogs
    .filter((log) => log.studyDate === today)
    .reduce((sum, log) => sum + log.minutes, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthMinutes = studyLogs
    .filter((log) => log.studyDate.slice(0, 7) === currentMonth)
    .reduce((sum, log) => sum + log.minutes, 0);
  const getStartOfWeek = (date: Date) => {
    const copiedDate = new Date(date);
    const day = copiedDate.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    copiedDate.setDate(copiedDate.getDate() + diff);
    copiedDate.setHours(0, 0, 0, 0);

    return copiedDate;
  };

  const startOfWeek = getStartOfWeek(new Date());

  const weekMinutes = studyLogs
    .filter((log) => {
      const logDate = new Date(log.studyDate);
      logDate.setHours(0, 0, 0, 0);

      return logDate >= startOfWeek;
    })
    .reduce((sum, log) => sum + log.minutes, 0);

  const reactMinutes = studyLogs
    .filter((log) => log.category === "react")
    .reduce((sum, log) => sum + log.minutes, 0);

  const typescriptMinutes = studyLogs
    .filter((log) => log.category === "typescript")
    .reduce((sum, log) => sum + log.minutes, 0);

  const sqlMinutes = studyLogs
    .filter((log) => log.category === "sql")
    .reduce((sum, log) => sum + log.minutes, 0);

  const getCategoryMinutes = (targetCategory: StudyCategory) => {
    return studyLogs
      .filter((log) => log.category === targetCategory)
      .reduce((sum, log) => sum + log.minutes, 0);
  };

  const skillCategories: StudyCategory[] = [
    "htmlCss",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "sql",
    "git",
    "excel",
    "other",
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Skill Growth Dashboard</h1>

        <p className="mb-6 text-slate-300">
          日々の学習内容と学習時間を記録して、スキルの成長を可視化するアプリです。
        </p>

        <section className="mb-6 rounded-lg bg-slate-900 p-4">
          <h2 className="mb-4 text-xl font-bold">学習サマリー</h2>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-md bg-slate-800 p-4">
              <p className="text-sm text-slate-400">今日</p>
              <p className="text-2xl font-bold text-purple-300">
                {todayMinutes}分
              </p>
            </div>

            <div className="rounded-md bg-slate-800 p-4">
              <p className="text-sm text-slate-400">今週</p>
              <p className="text-2xl font-bold text-purple-300">
                {weekMinutes}分
              </p>
            </div>

            <div className="rounded-md bg-slate-800 p-4">
              <p className="text-sm text-slate-400">今月</p>
              <p className="text-2xl font-bold text-purple-300">
                {monthMinutes}分
              </p>
            </div>

            <div className="rounded-md bg-slate-800 p-4">
              <p className="text-sm text-slate-400">合計</p>
              <p className="text-2xl font-bold text-purple-300">
                {totalMinutes}分
              </p>
            </div>
          </div>
        </section>

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

        <section className="mb-6 rounded-lg bg-slate-900 p-4">
          <h2 className="mb-4 text-xl font-bold">スキル別ステータス</h2>

          <div className="space-y-3">
            {skillCategories.map((skillCategory) => {
              const skillMinutes = getCategoryMinutes(skillCategory);

              return (
                <div key={skillCategory}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{categoryLabels[skillCategory]}</span>
                    <span>{skillMinutes}分</span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-700">
                    <div
                      className="h-3 rounded-full bg-purple-500"
                      style={{ width: `${Math.min(skillMinutes, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
      </div>
    </main>
  );
}
