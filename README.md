# cryptarithmetic-trainer

数字から英単語を当てるクイズアプリケーション

## 開発

```bash
npm install
npm run dev
```

## 単語リストの更新

txtファイル（各行に1単語）から単語リストを生成できます。

```bash
node scripts/convert-words.js <txtファイルのパス>
```

例：
```bash
node scripts/convert-words.js words.txt
```

このスクリプトは以下の処理を行います：
- txtファイルの各行から単語を読み込み
- 空行を除去
- 前後の空白をトリミング
- 小文字に変換
- 重複を除去
- `src/data/words.ts`に自動的に出力
