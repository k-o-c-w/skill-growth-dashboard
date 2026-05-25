"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import StudyLogForm from "@/components/StudyLogForm";
import StudySummary from "@/components/StudySummary";
import SkillStatus from "@/components/SkillStatus";
import StudyLogList from "@/components/StudyLogList";

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
    id: number;
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
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<StudyCategory>("react");
  const [editingMinutes, setEditingMinutes] = useState("");
  const [editingStudyDate, setEditingStudyDate] = useState("");
  const [editingMemo, setEditingMemo] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("ログイン情報の取得に失敗しました", error);
        return;
      }

      setUser(data.user);
    };

    checkUser();
  }, []);

  const handleSignUp = async () => {
    if (authEmail.trim() === "" || authPassword.trim() === "") {
      setAuthMessage("メールアドレスとパスワードを入力してください");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthMessage("新規登録に失敗しました");
      console.error("新規登録に失敗しました", error);
      return;
    }

    if (data.session) {
      setUser(data.user);
      setAuthMessage("新規登録してログインしました");
    } else {
      setAuthMessage(
        "確認メールを送信しました。メール内のリンクを確認してください",
      );
    }
  };

  const handleLogin = async () => {
    if (authEmail.trim() === "" || authPassword.trim() === "") {
      setAuthMessage("メールアドレスとパスワードを入力してください");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthMessage("ログインに失敗しました");
      console.error("ログインに失敗しました", error);
      return;
    }

    setUser(data.user);
    setAuthMessage("ログインしました");
    setAuthPassword("");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage("ログアウトに失敗しました");
      console.error("ログアウトに失敗しました", error);
      return;
    }

    setUser(null);
    setStudyLogs([]);
    setAuthEmail("");
    setAuthPassword("");
    setAuthMessage("ログアウトしました");
  };

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
  }, [user]);

  const handleAddStudyLog = async () => {
    if (!user) {
      setAuthMessage("ログインしてください");
      return;
    }
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
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabaseへの学習ログ追加に失敗しました", error);
      return;
    }

    console.log("Supabaseに追加した学習ログ:", data);

    const newStudyLog: StudyLog = {
      id: data.id,
      title: data.title,
      category: data.category as StudyCategory,
      minutes: data.minutes,
      studyDate: data.study_date,
      memo: data.memo ?? "",
      createdAt: data.created_at,
    };

    setStudyLogs([...studyLogs, newStudyLog]);

    setTitle("");
    setCategory("react");
    setMinutes("");
    setStudyDate("");
    setMemo("");
  };

  const handleDeleteStudyLog = async (id: number) => {
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
          <h2 className="mb-4 text-xl font-bold">アカウント</h2>

          {user ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-slate-300">ログイン中：{user.email}</p>

              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-600 px-4 py-2 font-bold hover:bg-slate-500"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="メールアドレス"
                className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
              />

              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="パスワード"
                className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleLogin}
                  className="flex-1 rounded-md bg-purple-600 px-4 py-2 font-bold hover:bg-purple-700"
                >
                  ログイン
                </button>

                <button
                  onClick={handleSignUp}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700"
                >
                  新規登録
                </button>
              </div>
            </div>
          )}

          {authMessage && (
            <p className="mt-3 text-sm text-purple-300">{authMessage}</p>
          )}
        </section>

        {user ? (
          <>
            <StudySummary
              todayMinutes={todayMinutes}
              weekMinutes={weekMinutes}
              monthMinutes={monthMinutes}
              totalMinutes={totalMinutes}
            />

            <StudyLogForm
              title={title}
              category={category}
              minutes={minutes}
              studyDate={studyDate}
              memo={memo}
              setTitle={setTitle}
              setCategory={setCategory}
              setMinutes={setMinutes}
              setStudyDate={setStudyDate}
              setMemo={setMemo}
              handleAddStudyLog={handleAddStudyLog}
            />

            <SkillStatus
              skillCategories={skillCategories}
              categoryLabels={categoryLabels}
              getCategoryMinutes={getCategoryMinutes}
            />

            <StudyLogList
              studyLogs={studyLogs}
              editingLogId={editingLogId}
              editingTitle={editingTitle}
              editingCategory={editingCategory}
              editingMinutes={editingMinutes}
              editingStudyDate={editingStudyDate}
              editingMemo={editingMemo}
              categoryLabels={categoryLabels}
              setEditingTitle={setEditingTitle}
              setEditingCategory={setEditingCategory}
              setEditingMinutes={setEditingMinutes}
              setEditingStudyDate={setEditingStudyDate}
              setEditingMemo={setEditingMemo}
              handleStartEdit={handleStartEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleDeleteStudyLog={handleDeleteStudyLog}
            />
          </>
        ) : (
          <section className="rounded-lg bg-slate-900 p-4">
            <p className="text-slate-300">
              学習ログを記録するには、ログインまたは新規登録してください。
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
