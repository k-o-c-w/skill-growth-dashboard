"use client";

import { useEffect, useState } from "react";
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
      </div>
    </main>
  );
}
