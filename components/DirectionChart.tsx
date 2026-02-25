'use client'
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts'
import { Analytics } from '@/lib/types'

const DIR_COLORS = ['#06B6D4', '#F97316', '#84CC16']

interface Props { analytics: Analytics }

export default function DirectionChart({ analytics }: Props) {
  const { directionDist } = analytics

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-0.5">向き分布（正面 / 側面 / 背面）</h3>
      <p className="text-xs text-slate-400 mb-3">カメラに対する向き — 側面が多いほど「通過型」来訪者が多い</p>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie data={directionDist} dataKey="value" cx="50%" cy="50%" outerRadius={70}
              startAngle={90} endAngle={-270}>
              {directionDist.map((_, i) => <Cell key={i} fill={DIR_COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v.toLocaleString()}人`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2.5">
          {directionDist.map((d, i) => (
            <div key={d.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700" style={{ color: DIR_COLORS[i] }}>● {d.name}</span>
                <span className="font-bold text-slate-800">{d.pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${d.pct}%`, backgroundColor: DIR_COLORS[i] }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400 pt-1">
            {directionDist[1]?.pct > 60
              ? '📍 側面が多く、通過型の流動人口が主体と考えられます'
              : '📍 正面・背面も一定数あり、滞留型来訪者が含まれます'}
          </p>
        </div>
      </div>
    </div>
  )
}
