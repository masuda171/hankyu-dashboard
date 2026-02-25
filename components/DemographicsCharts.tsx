'use client'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
} from 'recharts'
import { Analytics } from '@/lib/types'

const GENDER_COLORS = ['#3B82F6', '#EC4899']
const AGE_COLORS    = ['#10B981', '#F59E0B', '#8B5CF6']

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.05) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

interface Props { analytics: Analytics }

export default function DemographicsCharts({ analytics }: Props) {
  const { genderDist, ageDist, genderAgeDist } = analytics

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Gender Pie */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">性別分布</h3>
        <p className="text-xs text-slate-400 mb-3">検出人数ベース</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={genderDist} dataKey="value" cx="50%" cy="50%" outerRadius={75}
              labelLine={false} label={renderCustomLabel}>
              {genderDist.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString()}人`, n]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age Pie */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">年齢層分布</h3>
        <p className="text-xs text-slate-400 mb-3">推定年齢カテゴリ</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={ageDist} dataKey="value" cx="50%" cy="50%" outerRadius={75}
              labelLine={false} label={renderCustomLabel}>
              {ageDist.map((_, i) => <Cell key={i} fill={AGE_COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString()}人`, n]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gender x Age Stacked Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">性別 × 年齢層</h3>
        <p className="text-xs text-slate-400 mb-3">クロス集計</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={genderAgeDist} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="age" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString()}人`, n]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Male" name="男性" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Female" name="女性" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
