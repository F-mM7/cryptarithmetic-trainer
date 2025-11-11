import { CryptarithmeticProblem, Solution } from '../types/cryptarithmetic';

/**
 * ソルバーのインターフェース
 */
export interface Solver {
  /**
   * 覆面算の全ての解を求める
   * @param problem 覆面算の問題
   * @returns 解の配列
   */
  solve(problem: CryptarithmeticProblem): Solution[];

  /**
   * 覆面算の解の個数を数える（最適化版）
   * @param problem 覆面算の問題
   * @param maxCount この個数以上見つかったら探索を打ち切る
   * @returns 解の個数
   */
  countSolutions(problem: CryptarithmeticProblem, maxCount?: number): number;
}
