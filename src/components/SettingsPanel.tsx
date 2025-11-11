import './SettingsPanel.css';

interface SettingsPanelProps {
  minDigits: number;
  maxDigits: number;
  minCoverageRate: number;
  onMinDigitsChange: (digits: number) => void;
  onMaxDigitsChange: (digits: number) => void;
  onMinCoverageRateChange: (rate: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function SettingsPanel({
  minDigits,
  maxDigits,
  minCoverageRate,
  onMinDigitsChange,
  onMaxDigitsChange,
  onMinCoverageRateChange,
  onGenerate,
  isGenerating
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <h2>覆面算生成設定</h2>

      <div className="setting-group">
        <label htmlFor="minDigits">最小桁数: {minDigits}</label>
        <input
          type="range"
          id="minDigits"
          min="2"
          max="8"
          value={minDigits}
          onChange={(e) => onMinDigitsChange(Number(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label htmlFor="maxDigits">最大桁数: {maxDigits}</label>
        <input
          type="range"
          id="maxDigits"
          min="2"
          max="8"
          value={maxDigits}
          onChange={(e) => onMaxDigitsChange(Number(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label htmlFor="minCoverageRate">最低覆面率: {minCoverageRate}%</label>
        <input
          type="range"
          id="minCoverageRate"
          min="0"
          max="100"
          step="5"
          value={minCoverageRate}
          onChange={(e) => onMinCoverageRateChange(Number(e.target.value))}
        />
        <p className="help-text">
          指定された覆面率を保証します。高い最低覆面率を指定すると、計算時間が長くなるおそれがあります。
        </p>
      </div>

      <button
        className="generate-button"
        onClick={onGenerate}
        disabled={isGenerating || minDigits > maxDigits}
      >
        {isGenerating ? '生成中...' : '覆面算を生成'}
      </button>

      {minDigits > maxDigits && (
        <p className="error-message">最小桁数は最大桁数以下にしてください</p>
      )}
    </div>
  );
}
