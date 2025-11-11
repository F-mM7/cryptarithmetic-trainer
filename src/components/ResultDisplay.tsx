import { useState, useEffect } from 'react';
import { GenerationResult } from '../types/cryptarithmetic';
import './ResultDisplay.css';

interface ResultDisplayProps {
  result: GenerationResult | null;
}

// 文字列内の数字を白色で表示するヘルパー関数
function renderMixedString(str: string) {
  return str.split('').map((char, index) => {
    const isDigit = /\d/.test(char);
    return (
      <span key={index} className={isDigit ? 'digit' : ''}>
        {char}
      </span>
    );
  });
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [showSolution, setShowSolution] = useState(false);

  // result が変わったら解答を隠す
  useEffect(() => {
    setShowSolution(false);
  }, [result]);

  if (!result) {
    return (
      <div className="result-display">
        <div className="no-result">
          <p>設定を選択して「覆面算を生成」ボタンをクリックしてください</p>
        </div>
      </div>
    );
  }

  const { problem, solution } = result;

  return (
    <div className="result-display">
      <h2>生成された覆面算</h2>

      <div className="problem-display">
        <div className="vertical-calc">
          <div className="calc-row">
            <span className="calc-number">{renderMixedString(problem.operand1)}</span>
          </div>
          <div className="calc-row operator-row">
            <span className="calc-operator">{problem.operation}</span>
            <span className="calc-number">{renderMixedString(problem.operand2)}</span>
          </div>
          <div className="calc-line"></div>
          <div className="calc-row">
            <span className="calc-number">{renderMixedString(problem.result)}</span>
          </div>
        </div>
      </div>

      <button
        className="solution-toggle"
        onClick={() => setShowSolution(!showSolution)}
      >
        {showSolution ? '解答を隠す' : '解答を表示'}
      </button>

      {showSolution && (
        <div className="solution-display">
          <h3>解答</h3>
          <div className="mapping">
            {Array.from(solution.mapping.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, digit]) => (
                <div key={letter} className="mapping-item">
                  <span className="letter">{letter}</span>
                  <span className="arrow">→</span>
                  <span className="digit">{digit}</span>
                </div>
              ))}
          </div>
          <div className="numeric-expression">
            <p>元の数式（筆算形式）:</p>
            <div className="vertical-calc solution-calc">
              <div className="calc-row">
                <span className="calc-number">{solution.operand1}</span>
              </div>
              <div className="calc-row operator-row">
                <span className="calc-operator">{problem.operation}</span>
                <span className="calc-number">{solution.operand2}</span>
              </div>
              <div className="calc-line"></div>
              <div className="calc-row">
                <span className="calc-number">{solution.result}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
