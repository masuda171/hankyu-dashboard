'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TimePoint } from '@/lib/types'

interface Props {
  timeSeries: TimePoint[]
  peakMinute: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">🕐 {label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-bold text-slate-800">{p.value}人</span>
        </div>
      ))}
    </div>
  )
}

export default function TimeSeriesChart({ timeSeries, peakMinute }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">時系列 来訪者数（分ごと）</h3>
      <p className="text-xs text-slate-400 mb-4">各フレームの検出人数推移</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={timeSeries} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            label={{ value: '人数', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {peakMinute && (
            <ReferenceLine
              x={peakMinute}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{ value: 'ピーク', position: 'top', fontSize: 10, fill: '#F59E0B' }}
            />
          )}
          <Line
            type="monotone" dataKey="count" name="合計"
            stroke="#4F46E5" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
          />
          <Line
            type="monotone" dataKey="female" name="女性"
            stroke="#EC4899" strokeWidth={1.5} dot={false} strokeDasharray="4 2"
          />
          <Line
            type="monotone" dataKey="male" name="男性"
            stroke="#3B82F6" strokeWidth={1.5} dot={false} strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
