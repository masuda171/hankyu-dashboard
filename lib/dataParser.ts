import * as XLSX from 'xlsx'
import { PersonRecord, CameraData } from './types'

export function extractCameraNumber(filename: string): number {
  const match = filename.match(/camera(\d+)/i)
  return match ? parseInt(match[1]) : Math.floor(Math.random() * 100) + 99
}

export async function parseXlsxFile(file: File): Promise<CameraData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const records = XLSX.utils.sheet_to_json<PersonRecord>(worksheet)
        const cameraId = extractCameraNumber(file.name)
        resolve({ cameraId, records, filename: file.name })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function parseImageTime(imageName: string): string {
  const match = imageName.match(/_\d{8}_(\d{2})(\d{2})/)
  if (!match) return '??:??'
  return `${match[1]}:${match[2]}`
}
