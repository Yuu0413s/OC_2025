// プロジェクト全体の型定義管理

// APIから取得する小説の基本情報インターフェース
export interface Novel {
    title: string;
    ncode: string;
    writer: string;
    story: string;
}

// 類似度検索結果のインターフェース
export type NarouApiResponse = [
  { allcount: number },
  ...Novel[]
];
