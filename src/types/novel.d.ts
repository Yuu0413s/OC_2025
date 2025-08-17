// Novel.d.ts

/**
 * APIから取得する小説の基本情報インターフェース
 */
export interface Novel {
    title: string;
    writer: string;
    story: string;
  // 必要に応じて、他のプロパティも追加できます
  // (例: `ncode?: string;`, `novel_type?: number;`など)
}

/**
 * 類似度検索結果のインターフェース
 * Novelの基本情報に、類似度（similarity）プロパティを追加
 */
export interface SimilarityResult extends Novel {
    similarity: number;
}
