/**
 * 重み付きランダム選択
 * @param items Mapオブジェクト（キー: アイテム、値: 重み）
 * @returns 選択されたアイテム
 */
export function weightedRandomSelect<T>(items: Map<T, number>): T {
  const totalWeight = Array.from(items.values()).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [item, weight] of items.entries()) {
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }

  // フォールバック（通常は到達しない）
  return Array.from(items.keys())[0];
}
