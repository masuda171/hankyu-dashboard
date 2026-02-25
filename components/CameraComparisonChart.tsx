'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Cell,
} from 'recharts'
import { CameraComparisonRow } from '@/lib/types'

interface Props { rows: CameraComparisonRow[] }

export default function CameraComparisonChart({ rows }: Props) {
  const radarData = [
    { axis: '女性比率',       ...Object.fromEntries(rows.map(r => [r.camera, r.femalePct])) },
    { axis: 'リュック率',     ...Object.fromEntries(rows.map(r => [r.camera, r.backpackPct])) },
    { axis: 'ショルダー率',   ...Object.fromEntries(rows.map(r => [r.camera, r.shoulderBagPct])) },
    { axis: '18歳未満率',     ...Object.fromEntries(rows.map(r => [r.camera, r.less18Pct])) },
    { axis: '側面率',         ...Object.fromEntries(rows.map(r => [r.camera, r.sidePct])) },
    { axis: '60歳超率',       ...Object.fromEntries(rows.map(r => [r.camera, r.over60Pct])) },
  ]

  const COLORS = ['#4F46E5','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6','#06B6D4','#F97316','#84CC16','#EF4444']

  return (
    <div className="space-y-4">
      {/* Bar: total count */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">カメラ別 検出人数</h3>
        <p className="text-xs text-slate-400 mb-4">各カメラエリアの通行量比較</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="camera" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => [`${v.toLocaleString()}人`, '検出人数']} />
            <Bar dataKey="total" name="検出人数" radius={[4, 4, 0, 0]}>
              {rows.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grouped bar: female% and backpack% */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-0.5">カメラ別 属性比較</h3>
        <p className="text-xs text-slate-400 mb-4">女性比率・リュック率・ショルダー率</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="camera" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number, n: string) => [`${v.toFixed(1)}%`, n]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="femalePct" name="女性比率" fill="#EC4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="backpackPct" name="リュック率" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shoulderBagPct" name="ショルダー率" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      {rows.length >= 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-0.5">カメラ別 多軸比較（レーダー）</h3>
          <p className="text-xs text-slate-400 mb-4">各エリアの来訪者属性プロファイル</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickCount={4} />
              {rows.map((r, i) => (
                <Radar key={r.camera} name={r.camera} dataKey={r.camera}
                  stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15}
                  strokeWidth={2} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number, n: string) => [`${v.toFixed(1)}%`, n]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">カメラ別サマリーテーブル</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold">
              <th className="text-left py-2 px-3 rounded-l-lg">カメラ</th>
              <th className="text-right py-2 px-3">検出人数</th>
              <th className="text-right py-2 px-3">女性%</th>
              <th className="text-right py-2 px-3">リュック%</th>
              <th className="text-right py-2 px-3">ショルダー%</th>
              <th className="text-right py-2 px-3">18歳未満%</th>
              <th className="text-right py-2 px-3 rounded-r-lg">ピーク時刻</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.camera} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-medium" style={{ color: COLORS[i % COLORS.length] }}>{r.camera}</td>
                <td className="py-2 px-3 text-right text-slate-700 font-medium">{r.total.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-slate-600">{r.femalePct.toFixed(1)}%</td>
                <td className="py-2 px-3 text-right text-slate-600">{r.backpackPct.toFixed(1)}%</td>
                <td className="py-2 px-3 text-right text-slate-600">{r.shoulderBagPct.toFixed(1)}%</td>
                <td className="py-2 px-3 text-right text-slate-600">{r.less18Pct.toFixed(1)}%</td>
                <td className="py-2 px-3 text-right text-slate-600 font-medium">{r.peakMinute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
