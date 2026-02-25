'use client'
import { Lightbulb, TrendingUp, Calendar, Users, MapPin, BarChart2 } from 'lucide-react'

const proposals = [
  {
    icon: <Calendar className="w-5 h-5 text-amber-600" />,
    color: 'bg-amber-50 border-amber-200',
    titleColor: 'text-amber-700',
    title: 'イルミネーション前後の比較分析',
    period: '実施期間: 11/21〜12/25',
    desc: '本データは11/26（イルミネーション期間中）のもの。同エリアの非実施期間（10月など）と比較することで、イルミネーションによる来訪者層の変化（ファミリー層・観光客の増減など）を定量化できます。',
    items: ['平日vs土日の性別・年齢構成変化', 'リュック率（観光客推定指標）の期間比較', 'ピーク時刻のシフト（通勤者vs観光客）'],
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    color: 'bg-indigo-50 border-indigo-200',
    titleColor: 'text-indigo-700',
    title: '時間帯別ターゲット属性分析',
    period: 'データ期間が広がれば可能',
    desc: '12時台は社会人ランチ層（18〜60歳が98.6%）が主体。朝・夕・夜でどう属性が変化するかを可視化することで、時間帯別のテナントMixやプロモーション戦略の最適化に活用できます。',
    items: ['朝（通勤）・昼（ランチ）・夕方（買い物）・夜（イルミネーション）の比較', '子供連れ推定（18歳未満検出率）のピーク時間特定', '女性単独vs女性グループの推定（将来的なグループ検出との組み合わせ）'],
  },
  {
    icon: <MapPin className="w-5 h-5 text-emerald-600" />,
    color: 'bg-emerald-50 border-emerald-200',
    titleColor: 'text-emerald-700',
    title: 'エリア別来訪者プロファイリング',
    period: 'カメラ10台のデータが揃えば可能',
    desc: '各カメラ（エリア）ごとに来訪者属性が異なるため、エリアの特性（通り抜け路 vs 滞留エリア、ファミリー向け vs ビジネス向け）を客観的データで示せます。',
    items: ['側面率が高い→通過型エリア（動線改善の優先度高）', '正面率が高い→滞留型エリア（コンテンツ強化余地）', 'リュック率が高いエリア→観光客集積ポイント（案内・飲食誘導）'],
  },
  {
    icon: <Users className="w-5 h-5 text-pink-600" />,
    color: 'bg-pink-50 border-pink-200',
    titleColor: 'text-pink-700',
    title: 'ターゲット顧客層の可視化レポート',
    period: '定期報告ツールとして',
    desc: '月次・週次で来訪者属性レポートを自動生成することで、施策効果の継続モニタリングが可能に。イベント実施→来訪者属性変化→テナント売上との相関分析に発展できます。',
    items: ['月次属性推移レポートの自動化', 'イベント効果測定（実施前後比較）', '将来的なテナント売上データとの統合分析'],
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-violet-600" />,
    color: 'bg-violet-50 border-violet-200',
    titleColor: 'text-violet-700',
    title: '服装属性からの季節・天候影響分析',
    period: '長期データで可能',
    desc: '11月下旬は長袖99.9%・コート1.6%と防寒が主体。月次で服装属性の変化を追うことで、季節進行や天候が来訪者行動に与える影響を把握し、屋外・屋内エリアのレイアウト改善に活かせます。',
    items: ['防寒着着用率と来訪者数の相関', '雨天・晴天での来訪者属性・人数比較', '服装から季節感イベント訴求効果の測定'],
  },
]

export default function InsightProposal() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-800">長期データで実現できる分析・活用提案</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        現在は11/26 12時台のみのデータですが、期間・時間帯を広げることで以下の分析が可能になります。
        イルミネーション施策の効果検証や今後の不動産活用戦略の根拠として活用できます。
      </p>
      <div className="space-y-3">
        {proposals.map((p, i) => (
          <div key={i} className={`rounded-xl border p-4 ${p.color}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{p.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-bold ${p.titleColor}`}>{p.title}</h4>
                  <span className="text-xs bg-white/60 text-slate-500 px-2 py-0.5 rounded-full border">{p.period}</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{p.desc}</p>
                <ul className="space-y-0.5">
                  {p.items.map((item, j) => (
                    <li key={j} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
