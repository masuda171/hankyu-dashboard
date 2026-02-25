# 阪急阪神 来訪者属性ダッシュボード

カメラ映像から得られた属性推定データを分析・可視化するNext.jsアプリです。
カメラ1〜10のXLSXファイルを読み込み、ブラウザ上でインタラクティブに分析できます。

---

## セットアップ（初回のみ）

### 前提条件
- Node.js 18以上がインストールされていること
  - 確認: `node --version`
  - インストール: https://nodejs.org/

### 手順

```bash
# 1. このフォルダに移動
cd hankyu-dashboard

# 2. 依存パッケージをインストール（初回のみ・数分かかります）
npm install

# 3. 開発サーバーを起動
npm run dev
```

起動後、ブラウザで http://localhost:3000 を開いてください。

---

## 使い方

1. **XLSXファイルをアップロード**
   ドラッグ＆ドロップ、またはクリックしてファイルを選択します。
   `timeseries_attributes_camera1.xlsx` 〜 `camera10.xlsx` を複数同時に選択可能です。

2. **カメラを選択**
   「全カメラ合計」または個別カメラを選択して表示を切り替えます。

3. **タブで分析を切り替え**
   - 📊 **概要**: KPIカード・時系列チャート・向き分布
   - 👥 **来訪者属性**: 性別・年齢層・クロス集計
   - 👗 **服装・持ち物**: 着用率・バッグ種別
   - 📡 **カメラ比較**: 複数カメラの比較（2台以上で有効）
   - 💡 **分析提案**: 長期データ活用の提案

---

## ファイル名のルール

カメラ番号は **ファイル名内の `cameraX`** から自動認識されます。

| ファイル名 | 認識カメラID |
|---|---|
| timeseries_attributes_camera1.xlsx | カメラ1 |
| timeseries_attributes_camera10.xlsx | カメラ10 |

---

## データ仕様

### 入力XLSXの列

| 列名 | 内容 |
|---|---|
| image_name | 画像ファイル名（時刻情報を含む） |
| person_id | フレーム内の人物ID |
| age | `AgeLess18` / `Age18-60` / `AgeOver60` |
| gender | `Male` / `Female` |
| Front / Side / Back | カメラへの向き（Yes/No） |
| ShoulderBag / Backpack / HandBag | バッグ種別（Yes/No） |
| LongSleeve / Trousers など | 服装属性（Yes/No） |

### 時刻の読み取り

画像ファイル名から自動的に時刻（HH:MM）を抽出します。
例: `b593f5cd66edab03_20251126_120050161_0000050741_01.jpg` → `12:00`

---

## 技術スタック

- **Next.js 14** (App Router)
- **Recharts** — グラフ描画
- **SheetJS (xlsx)** — XLSXファイルのブラウザ内パース
- **Tailwind CSS** — スタイリング
- **lucide-react** — アイコン

---

## トラブルシューティング

**`npm install` でエラーが出る場合:**
```bash
# Node.jsのバージョンを確認
node --version  # 18以上が必要

# キャッシュクリアして再試行
npm cache clean --force
npm install
```

**ポート3000が使えない場合:**
```bash
npm run dev -- -p 3001
# → http://localhost:3001 で起動
```
