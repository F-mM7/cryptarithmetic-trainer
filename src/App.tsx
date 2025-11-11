import { useState, useEffect } from 'react';
import './App.css';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { GenerationResult } from './types/cryptarithmetic';
import { BacktrackingSolver } from './solvers/backtracking';
import { CryptarithmeticGenerator } from './generators/cryptarithmetic-generator';

function App() {
  const [minDigits, setMinDigits] = useState(4);
  const [maxDigits, setMaxDigits] = useState(5);
  const [minCoverageRate, setMinCoverageRate] = useState(75);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null); // 解答を隠す

    // 非同期処理として実行（UIをブロックしない）
    setTimeout(() => {
      try {
        // ソルバーを作成
        const solver = new BacktrackingSolver();

        // ジェネレーターを作成
        const generator = new CryptarithmeticGenerator(solver);

        // 覆面算を生成（加算のみ）
        const generationResult = generator.generate({
          operation: '+',
          minDigits,
          maxDigits,
          minCoverageRate
        });

        setResult(generationResult);
        setError(null);
      } catch (err) {
        console.error('生成エラー:', err);
        setError(err instanceof Error ? err.message : '生成に失敗しました');
        setResult(null);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  // 初回アクセス時に自動生成
  useEffect(() => {
    handleGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <main className="app-main">
        <div className="settings-section">
          <SettingsPanel
            minDigits={minDigits}
            maxDigits={maxDigits}
            minCoverageRate={minCoverageRate}
            onMinDigitsChange={setMinDigits}
            onMaxDigitsChange={setMaxDigits}
            onMinCoverageRateChange={setMinCoverageRate}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {error && (
            <div className="error-display">
              <h3>エラー</h3>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="result-section">
          <ResultDisplay result={result} />
        </div>
      </main>
    </div>
  );
}

export default App;
