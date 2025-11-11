import { CryptarithmeticProblem, Solution } from '../types/cryptarithmetic';
import { Solver } from './types';

/**
 * バックトラッキングソルバー
 */
export class BacktrackingSolver implements Solver {
  solve(problem: CryptarithmeticProblem): Solution[] {
    const letters = this.extractLetters(problem);
    const solutions: Solution[] = [];

    this.backtrack(problem, letters, 0, new Map(), new Set(), solutions);

    return solutions;
  }

  countSolutions(problem: CryptarithmeticProblem, maxCount = Infinity): number {
    const letters = this.extractLetters(problem);
    let count = 0;

    const countCallback = () => {
      count++;
      return count >= maxCount;
    };

    this.backtrackCount(problem, letters, 0, new Map(), new Set(), countCallback);

    return count;
  }

  /**
   * 問題から文字を抽出（重複なし、'?'は除外）
   */
  private extractLetters(problem: CryptarithmeticProblem): string[] {
    const letterSet = new Set<string>();
    const addLetters = (str: string) => {
      for (const char of str) {
        if (char !== '?' && /[A-Z]/i.test(char)) {
          letterSet.add(char);
        }
      }
    };

    addLetters(problem.operand1);
    addLetters(problem.operand2);
    addLetters(problem.result);

    return Array.from(letterSet);
  }

  /**
   * バックトラッキングで全解を探索
   */
  private backtrack(
    problem: CryptarithmeticProblem,
    letters: string[],
    index: number,
    mapping: Map<string, number>,
    usedDigits: Set<number>,
    solutions: Solution[]
  ): void {
    // すべての文字に数字を割り当てた
    if (index === letters.length) {
      if (this.isValid(problem, mapping)) {
        solutions.push(this.createSolution(problem, mapping));
      }
      return;
    }

    const letter = letters[index];

    // 0-9の数字を試す
    for (let digit = 0; digit <= 9; digit++) {
      if (usedDigits.has(digit)) continue;

      // 先頭の文字は0にできない
      if (digit === 0 && this.isLeadingLetter(letter, problem)) {
        continue;
      }

      // 割り当てを試行
      mapping.set(letter, digit);
      usedDigits.add(digit);

      this.backtrack(problem, letters, index + 1, mapping, usedDigits, solutions);

      // バックトラック
      mapping.delete(letter);
      usedDigits.delete(digit);
    }
  }

  /**
   * バックトラッキングで解の個数を数える（最適化版）
   */
  private backtrackCount(
    problem: CryptarithmeticProblem,
    letters: string[],
    index: number,
    mapping: Map<string, number>,
    usedDigits: Set<number>,
    callback: () => boolean
  ): boolean {
    if (index === letters.length) {
      if (this.isValid(problem, mapping)) {
        return callback(); // trueが返ってきたら探索を打ち切る
      }
      return false;
    }

    const letter = letters[index];

    for (let digit = 0; digit <= 9; digit++) {
      if (usedDigits.has(digit)) continue;
      if (digit === 0 && this.isLeadingLetter(letter, problem)) continue;

      mapping.set(letter, digit);
      usedDigits.add(digit);

      const shouldStop = this.backtrackCount(
        problem,
        letters,
        index + 1,
        mapping,
        usedDigits,
        callback
      );

      mapping.delete(letter);
      usedDigits.delete(digit);

      if (shouldStop) return true;
    }

    return false;
  }

  /**
   * 先頭の文字かどうか
   */
  private isLeadingLetter(letter: string, problem: CryptarithmeticProblem): boolean {
    return (
      problem.operand1[0] === letter ||
      problem.operand2[0] === letter ||
      problem.result[0] === letter
    );
  }

  /**
   * マッピングが有効かどうか（算術が成立するか）
   */
  private isValid(problem: CryptarithmeticProblem, mapping: Map<string, number>): boolean {
    const operand1 = this.stringToNumber(problem.operand1, mapping);
    const operand2 = this.stringToNumber(problem.operand2, mapping);
    const result = this.stringToNumber(problem.result, mapping);

    if (operand1 === null || operand2 === null || result === null) {
      return false;
    }

    // 加算のみをサポート
    return operand1 + operand2 === result;
  }

  /**
   * 文字列を数値に変換（'?'は元の数字として扱う）
   */
  private stringToNumber(str: string, mapping: Map<string, number>): number | null {
    let result = 0;

    for (const char of str) {
      if (char === '?') {
        // '?'は数字として扱えないのでnullを返す
        // （実際には問題生成時に'?'は数字のまま残される）
        return null;
      } else if (/\d/.test(char)) {
        // 数字はそのまま
        result = result * 10 + parseInt(char, 10);
      } else if (/[A-Z]/i.test(char)) {
        // 文字はマッピングから取得
        const digit = mapping.get(char);
        if (digit === undefined) return null;
        result = result * 10 + digit;
      } else {
        return null;
      }
    }

    return result;
  }

  /**
   * Solutionオブジェクトを作成
   */
  private createSolution(problem: CryptarithmeticProblem, mapping: Map<string, number>): Solution {
    const operand1 = this.stringToNumber(problem.operand1, mapping)!;
    const operand2 = this.stringToNumber(problem.operand2, mapping)!;
    const result = this.stringToNumber(problem.result, mapping)!;

    return {
      mapping: new Map(mapping),
      operand1,
      operand2,
      result
    };
  }
}
