type StudySummaryProps = {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  totalMinutes: number;
};

export default function StudySummary({
  todayMinutes,
  weekMinutes,
  monthMinutes,
  totalMinutes,
}: StudySummaryProps) {
  return (
    <section className="mb-6 rounded-lg bg-slate-900 p-4">
      <h2 className="mb-4 text-xl font-bold">学習サマリー</h2>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">今日</p>
          <p className="text-2xl font-bold text-purple-300">{todayMinutes}分</p>
        </div>

        <div className="rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">今週</p>
          <p className="text-2xl font-bold text-purple-300">{weekMinutes}分</p>
        </div>

        <div className="rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">今月</p>
          <p className="text-2xl font-bold text-purple-300">{monthMinutes}分</p>
        </div>

        <div className="rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">合計</p>
          <p className="text-2xl font-bold text-purple-300">{totalMinutes}分</p>
        </div>
      </div>
    </section>
  );
}
