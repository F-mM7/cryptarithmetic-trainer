import {
  GenerationOptions,
  GenerationResult,
  NumericExpression,
  CryptarithmeticProblem
} from '../types/cryptarithmetic';
import { generateRandomExpression, getTotalDigitCount } from './number-generator';
import { Solver } from '../solvers/types';

/**
 * 覆面算ジェネレーター
 */
export class CryptarithmeticGenerator {
  private readonly LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // IとOを除外（1と0に見間違えやすいため）
  private readonly MAX_RETRY = 100; // 最大再試行回数

  constructor(private solver: Solver) {}

  /**
   * 覆面算を生成
   */
  generate(options: GenerationOptions): GenerationResult {
    const startTime = performance.now();

    for (let retry = 0; retry < this.MAX_RETRY; retry++) {
      // 1. ランダム数式を生成
      const numericExpr = generateRandomExpression(
        options.operation,
        options.minDigits,
        options.maxDigits
      );

      const totalDigits = getTotalDigitCount(numericExpr);

      // 2. 数字の出現回数をカウント
      const digitCounts = this.countDigits(numericExpr);

      // 3. 段階的に文字に置き換え
      const result = this.replaceDigitsGradually(
        numericExpr,
        digitCounts,
        totalDigits,
        options
      );

      if (result) {
        const endTime = performance.now();
        const generationTime = endTime - startTime;

        return {
          ...result,
          generationTime
        };
      }
    }

    throw new Error(
      `覆面算の生成に失敗しました（${this.MAX_RETRY}回試行）。パラメータを変更してください。`
    );
  }

  /**
   * 段階的に数字を文字に置き換える
   */
  private replaceDigitsGradually(
    numericExpr: NumericExpression,
    digitCounts: Map<string, number>,
    totalDigits: number,
    options: GenerationOptions
  ): Omit<GenerationResult, 'generationTime' | 'solverType'> | null {
    let currentProblem: CryptarithmeticProblem = {
      operand1: numericExpr.operand1.toString(),
      operand2: numericExpr.operand2.toString(),
      result: numericExpr.result.toString(),
      operation: numericExpr.operation
    };

    const usedLetters = new Set<string>();
    const digitToLetter = new Map<string, string>();
    let steps = 0;

    while (digitCounts.size > 0) {
      // 残っている数字をすべて試す
      const remainingDigits = Array.from(digitCounts.keys());
      let successfulReplacement = false;

      // 重み付きでソートした順序で試行（出現回数が多いものから優先）
      const sortedDigits = remainingDigits.sort(
        (a, b) => (digitCounts.get(b) || 0) - (digitCounts.get(a) || 0)
      );

      for (const digit of sortedDigits) {
        const letter = this.getRandomLetter(usedLetters);

        // 置き換えを試行
        const newProblem = this.replaceDigit(currentProblem, digit, letter);

        // 一意性を検証
        const solutionCount = this.solver.countSolutions(newProblem, 2);

        if (solutionCount === 1) {
          currentProblem = newProblem;
          usedLetters.add(letter);
          digitToLetter.set(digit, letter);
          digitCounts.delete(digit);
          steps++;
          successfulReplacement = true;
          break;
        }
      }

      // すべての数字を試しても一意性を保てなかった場合は終了
      if (!successfulReplacement) {
        break;
      }
    }

    // 覆面率を計算
    const coveredDigits = steps > 0 ? this.countCoveredDigits(currentProblem) : 0;
    const coverageRate = (coveredDigits / totalDigits) * 100;

    // 最低覆面率をチェック
    if (coverageRate < options.minCoverageRate) {
      return null;
    }

    // 解答を取得
    const solutions = this.solver.solve(currentProblem);
    if (solutions.length === 0) {
      throw new Error('解が見つかりませんでした（内部エラー）');
    }

    return {
      problem: currentProblem,
      solution: solutions[0],
      steps,
      coverageRate,
      totalDigits,
      coveredDigits
    };
  }

  /**
   * 数字の出現回数をカウント
   */
  private countDigits(expr: NumericExpression): Map<string, number> {
    const counts = new Map<string, number>();
    const allDigits =
      expr.operand1.toString() + expr.operand2.toString() + expr.result.toString();

    for (const char of allDigits) {
      counts.set(char, (counts.get(char) || 0) + 1);
    }

    return counts;
  }

  /**
   * 未使用の文字をランダムに選択
   */
  private getRandomLetter(usedLetters: Set<string>): string {
    const availableLetters = Array.from(this.LETTERS).filter(
      (letter) => !usedLetters.has(letter)
    );

    if (availableLetters.length === 0) {
      throw new Error('使用可能な文字がありません');
    }

    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    return availableLetters[randomIndex];
  }

  /**
   * 指定した数字を文字に置き換える
   */
  private replaceDigit(
    problem: CryptarithmeticProblem,
    digit: string,
    letter: string
  ): CryptarithmeticProblem {
    return {
      operand1: problem.operand1.replace(new RegExp(digit, 'g'), letter),
      operand2: problem.operand2.replace(new RegExp(digit, 'g'), letter),
      result: problem.result.replace(new RegExp(digit, 'g'), letter),
      operation: problem.operation
    };
  }

  /**
   * 覆面にされた桁数をカウント
   */
  private countCoveredDigits(problem: CryptarithmeticProblem): number {
    const allChars = problem.operand1 + problem.operand2 + problem.result;
    let count = 0;

    for (const char of allChars) {
      if (/[A-Z]/i.test(char)) {
        count++;
      }
    }

    return count;
  }
}
