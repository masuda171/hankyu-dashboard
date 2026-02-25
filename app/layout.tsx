import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '阪急阪神 来訪者属性ダッシュボード',
  description: 'カメラ映像からの来訪者属性分析ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
