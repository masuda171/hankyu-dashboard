'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { Analytics } from '@/lib/types'

interface Props { analytics: Analytics }

const BAG_COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#F97316']

export default function AttributesCharts({ analytics }: Props) {
  const { attributeFreqs, bagFreqs } = analytics

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Clothing Attributes Horizontal Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">服装属性（着用率）</h3>
        <p className="text-xs text-slate-400 mb-4">検出人数に占める割合（%）</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={attributeFreqs}
            layout="vertical"
            margin={{ top: 0, right: 50, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, '着用率']} />
            <Bar dataKey="pct" fill="#4F46E5" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="pct" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 10, fill: '#64748b' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bag Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">バッグ・荷物種別</h3>
        <p className="text-xs text-slate-400 mb-4">来訪者のバッグ携帯傾向</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={bagFreqs} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, '携帯率']} />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="pct" position="top" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 10, fill: '#64748b' }} />
              {bagFreqs.map((_, i) => <Cell key={i} fill={BAG_COLORS[i % BAG_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Insight note */}
        <div className="mt-4 bg-violet-50 rounded-xl p-3 border border-violet-100">
          <p className="text-xs font-semibold text-violet-700 mb-1">💡 インサイト</p>
          <p className="text-xs text-violet-600">
            リュック＋ショルダーバッグ合計 {((bagFreqs.find(b => b.name === 'Backpack')?.pct ?? 0) + (bagFreqs.find(b => b.name === 'ShoulderBag')?.pct ?? 0)).toFixed(1)}% が何らかの手荷物を携帯しています。
          </p>
        </div>
      </div>
    </div>
  )
}
