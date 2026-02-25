'use client'
import { Users, UserCheck, Clock, Backpack } from 'lucide-react'
import { Analytics } from '@/lib/types'

interface Props {
  analytics: Analytics
  cameraLabel: string
}

function Card({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

export default function OverviewCards({ analytics, cameraLabel }: Props) {
  const { totalPeople, uniqueImages, femalePct, peakMinute, bagFreqs } = analytics
  const backpackPct = bagFreqs.find(b => b.name === 'Backpack')?.pct ?? 0
  const shoulderBagPct = bagFreqs.find(b => b.name === 'ShoulderBag')?.pct ?? 0

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3 font-medium">{cameraLabel} の集計サマリー</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          label="検出人数（延べ）"
          value={totalPeople.toLocaleString()}
          sub={`${uniqueImages}フレームの合計`}
          color="bg-indigo-50"
        />
        <Card
          icon={<UserCheck className="w-5 h-5 text-pink-600" />}
          label="女性比率"
          value={`${femalePct.toFixed(1)}%`}
          sub={`男性 ${(100 - femalePct).toFixed(1)}%`}
          color="bg-pink-50"
        />
        <Card
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="ピーク時刻（分）"
          value={peakMinute}
          sub="最も人が多い時刻"
          color="bg-amber-50"
        />
        <Card
          icon={<Backpack className="w-5 h-5 text-emerald-600" />}
          label="バッグ携帯率"
          value={`${(backpackPct + shoulderBagPct).toFixed(1)}%`}
          sub={`リュック ${backpackPct.toFixed(1)}% / ショルダー ${shoulderBagPct.toFixed(1)}%`}
          color="bg-emerald-50"
        />
      </div>
    </div>
  )
}
