'use client'
import { useCallback, useState } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'

interface Props {
  uploadedFiles: string[]
  onUpload: (files: FileList) => Promise<void>
  onRemove: (filename: string) => void
}

export default function FileUpload({ uploadedFiles, onUpload, onRemove }: Props) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) {
      setLoading(true)
      await onUpload(e.dataTransfer.files)
      setLoading(false)
    }
  }, [onUpload])

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true)
      await onUpload(e.target.files)
      setLoading(false)
      e.target.value = ''
    }
  }, [onUpload])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-semibold text-slate-800">データファイルの読み込み</h2>
        <span className="text-xs text-slate-400 ml-1">（カメラ1〜10のXLSXファイル）</span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">読み込み中...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              ここにXLSXファイルをドロップ、またはクリックして選択
            </p>
            <p className="text-xs text-slate-400 mt-1">
              例: timeseries_attributes_camera1.xlsx〜camera10.xlsx（複数同時選択可）
            </p>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {uploadedFiles.map(fn => (
            <div key={fn} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {fn}
              <button onClick={() => onRemove(fn)} className="ml-1 hover:text-red-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
