//APIフォルダ内のファイルにて行っている処理を実行
import { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@xenova/transformers';

// 小説データの型定義
interface Novel {
    title: string;
    writer: string;
    story: string;
}

// 類似度検索結果の型定義
interface SimilarityResult extends Novel {
    similarity: number;
}

// 使用するモデル名とAPIのURL
const MODEL_NAME = 'xenova/multilingual-e5-small';
const API_URL = 'https://api.syosetu.com/novelapi/api/?out=json&int=200&of=t-w-s';

export const useSimilaritySearch = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [novels, setNovels] = useState<Novel[]>([]);
    const [pipe, setPipe] = useState<any>(null); // パイプラインインスタンスを保持するstate

  // モデルのロードとデータのフェッチ
    useEffect(() => {
        const initialize = async () => {
        try {
        // パイプライン（モデル）のロード
        const newPipe = await pipeline('feature-extraction', MODEL_NAME);
        setPipe(newPipe);

        // APIから小説データをフェッチ
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const apiData = await response.json();

        // APIレスポンスの最初の要素はメタデータなのでスキップ
        const processedNovels: Novel[] = apiData.slice(1).map((item: any) => ({
            title: item.title,
            writer: item.writer,
            story: item.story,
        }));
        setNovels(processedNovels);
        setLoading(false);
        } catch (e: any) {
        setError(e.message);
        setLoading(false);
        }
    };
    initialize();
  }, []); // 依存配列が空なので、コンポーネントのマウント時に一度だけ実行

  // 類似度計算のヘルパー関数
    const calculateCosineSimilarity = (vecA: number[], vecB: number[]) => {
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

  // 検索を実行する関数
    const search = useCallback(async (userTitle: string, userStory: string): Promise<SimilarityResult[]> => {
        if (!pipe || novels.length === 0) {
            return [];
    }

    const novelTexts = novels.map(n => `passage: ${n.title}。${n.story}`);
    const queryText = `query: ${userTitle}。${userStory}`;

    // 埋め込みを生成
    const embeddings = await pipe(novelTexts, { pooling: 'mean', normalize: true });
    const queryEmbedding = await pipe(queryText, { pooling: 'mean', normalize: true });

    // コサイン類似度を計算
    const results = novels.map((novel, index) => {
        const similarity = calculateCosineSimilarity(
        Array.from(queryEmbedding.data as Float32Array),
        Array.from(embeddings.data[index] as Float32Array)
        );
        return { ...novel, similarity };
    });

    // 類似度でソートし、上位5件を返す
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }, [pipe, novels]); // `pipe`と`novels`が変更された場合に`search`関数を再生成

    return { loading, error, search };
};
