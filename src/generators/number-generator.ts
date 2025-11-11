import { NumericExpression, Operation } from '../types/cryptarithmetic';

/**
 * ランダムな加算式を生成する
 * @param minDigits 最小桁数
 * @param maxDigits 最大桁数
 * @returns 生成された加算式
 */
export function generateRandomExpression(
  _operation: Operation, // 互換性のため残すが使用しない
  minDigits: number,
  maxDigits: number
): NumericExpression {
  const operand1 = generateRandomNumber(minDigits, maxDigits);
  const operand2 = generateRandomNumber(minDigits, maxDigits);
  const result = operand1 + operand2;

  return {
    operand1,
    operand2,
    result,
    operation: '+'
  };
}

/**
 * 指定桁数のランダムな数値を生成
 * @param minDigits 最小桁数
 * @param maxDigits 最大桁数
 * @returns ランダムな数値
 */
function generateRandomNumber(minDigits: number, maxDigits: number): number {
  // 桁数をランダムに選択
  const digits = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;

  // 最小値と最大値を計算
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  // ランダムな数値を生成
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 数値の桁数を取得
 */
export function getDigitCount(num: number): number {
  return num.toString().length;
}

/**
 * 数式全体の桁数を取得
 */
export function getTotalDigitCount(expr: NumericExpression): number {
  return (
    getDigitCount(expr.operand1) +
    getDigitCount(expr.operand2) +
    getDigitCount(expr.result)
  );
}
