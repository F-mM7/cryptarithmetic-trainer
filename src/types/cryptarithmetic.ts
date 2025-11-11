// 覆面算アプリケーションの型定義

export type Operation = '+';

export interface NumericExpression {
  operand1: number;
  operand2: number;
  result: number;
  operation: Operation;
}

export interface CryptarithmeticProblem {
  operand1: string;  // 例: "SEN7"
  operand2: string;  // 例: "10?5"
  result: string;    // 例: "10?E2"
  operation: Operation;
}

export interface Solution {
  mapping: Map<string, number>;  // 文字→数字
  operand1: number;
  operand2: number;
  result: number;
}

export interface GenerationOptions {
  operation: Operation;
  minDigits: number;
  maxDigits: number;
  minCoverageRate: number;  // 最低覆面率（0-100のパーセンテージ）
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GenerationResult {
  problem: CryptarithmeticProblem;
  solution: Solution;
  generationTime: number;  // ミリ秒
  steps: number;  // 置き換えステップ数
  coverageRate: number;  // 覆面率（0-100のパーセンテージ）
  totalDigits: number;  // 全体の桁数
  coveredDigits: number;  // 覆面にした桁数
}
