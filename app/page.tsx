'use client'
import { useState, useCallback, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import OverviewCards from '@/components/OverviewCards'
import TimeSeriesChart from '@/components/TimeSeriesChart'
import DemographicsCharts from '@/components/DemographicsCharts'
import AttributesCharts from '@/components/AttributesCharts'
import DirectionChart from '@/components/DirectionChart'
import CameraComparisonChart from '@/components/CameraComparisonChart'
import InsightProposal from '@/components/InsightProposal'
import { CameraData } from '@/lib/types'
import { parseXlsxFile } from '@/lib/dataParser'
import { computeAnalytics, computeCameraComparison } from '@/lib/analytics'

type TabKey = 'overview' | 'demographics' | 'appearance' | 'comparison' | 'proposal'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview',     label: '📊 概要' },
  { key: 'demographics', label: '👥 来訪者属性' },
  { key: 'appearance',   label: '👗 服装・持ち物' },
  { key: 'comparison',   label: '📡 カメラ比較' },
  { key: 'proposal',     label: '💡 分析提案' },
]

export default function Home() {
  const [cameras, setCameras] = useState<Map<number, CameraData>>(new Map())
  const [selectedCamera, setSelectedCamera] = useState<number | 'all'>('all')
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const handleUpload = useCallback(async (files: FileList) => {
    const newCameras = new Map(cameras)
    for (const file of Array.from(files)) {
      try {
        const data = await parseXlsxFile(file)
        newCameras.set(data.cameraId, data)
      } catch (e) {
        console.error('Failed to parse:', file.name, e)
      }
    }
    setCameras(newCameras)
    if (selectedCamera === 'all' && newCameras.size === 1) {
      const firstKey = newCameras.keys().next().value
      if (firstKey !== undefined) setSelectedCamera(firstKey)
    }
  }, [cameras, selectedCamera])

  const handleRemove = useCallback((filename: string) => {
    const newCameras = new Map(cameras)
    Array.from(newCameras.entries()).forEach(([id, cam]) => {
      if (cam.filename === filename) newCameras.delete(id)
    })
    setCameras(newCameras)
  }, [cameras])

  const currentRecords = useMemo(() => {
    if (selectedCamera === 'all') {
      return Array.from(cameras.values()).flatMap(c => c.records)
    }
    return cameras.get(selectedCamera)?.records ?? []
  }, [cameras, selectedCamera])

  const analytics = useMemo(() => computeAnalytics(currentRecords), [currentRecords])
  const comparisonRows = useMemo(() => computeCameraComparison(cameras), [cameras])

  const uploadedFiles = Array.from(cameras.values()).map(c => c.filename)
  const cameraLabel = selectedCamera === 'all'
    ? `全カメラ合計（${cameras.size}台）`
    : `カメラ${selectedCamera}`

  const sortedCameraIds = Array.from(cameras.keys()).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">阪急阪神 来訪者属性ダッシュボード</h1>
              <p className="text-xs text-indigo-300">カメラ映像属性推定データ 分析ツール — PoC 2025</p>
            </div>
          </div>
          {cameras.size > 0 && (
            <div className="text-right hidden md:block">
              <p className="text-xs text-indigo-300">読み込み済みカメラ</p>
              <p className="text-sm font-bold">{cameras.size}台 / 合計 {Array.from(cameras.values()).reduce((s, c) => s + c.records.length, 0).toLocaleString()}件</p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* File Upload */}
        <FileUpload uploadedFiles={uploadedFiles} onUpload={handleUpload} onRemove={handleRemove} />

        {cameras.size > 0 && (
          <>
            {/* Camera Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">表示対象:</span>
              <button
                onClick={() => setSelectedCamera('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCamera === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                全カメラ合計
              </button>
              {sortedCameraIds.map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedCamera(id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCamera === id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  カメラ{id}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-5">
              {activeTab === 'overview' && (
                <>
                  <OverviewCards analytics={analytics} cameraLabel={cameraLabel} />
                  <TimeSeriesChart timeSeries={analytics.timeSeries} peakMinute={analytics.peakMinute} />
                  <DirectionChart analytics={analytics} />
                </>
              )}

              {activeTab === 'demographics' && (
                <>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-indigo-700">
                    <strong>{cameraLabel}</strong> — 対象日時: 2025年11月26日 12:00〜12:57（イルミネーション期間中）
                  </div>
                  <DemographicsCharts analytics={analytics} />
                </>
              )}

              {activeTab === 'appearance' && (
                <AttributesCharts analytics={analytics} />
              )}

              {activeTab === 'comparison' && (
                cameras.size < 2 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-400 text-sm">複数カメラのファイルを読み込むと、カメラ間の比較分析が表示されます。</p>
                    <p className="text-xs text-slate-300 mt-2">現在 {cameras.size}台 読み込み済み（2台以上で有効）</p>
                  </div>
                ) : (
                  <CameraComparisonChart rows={comparisonRows} />
                )
              )}

              {activeTab === 'proposal' && (
                <InsightProposal />
              )}
            </div>
          </>
        )}

        {cameras.size === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">XLSXファイルをアップロードして分析を開始</p>
            <p className="text-xs mt-1">timeseries_attributes_camera1.xlsx などのファイルに対応</p>
          </div>
        )}
      </main>
    </div>
  )
}
