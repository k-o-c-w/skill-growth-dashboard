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

type SkillStatusProps = {
  skillCategories: StudyCategory[];
  categoryLabels: Record<StudyCategory, string>;
  getCategoryMinutes: (targetCategory: StudyCategory) => number;
};

export default function SkillStatus({
  skillCategories,
  categoryLabels,
  getCategoryMinutes,
}: SkillStatusProps) {
  return (
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
  );
}
