//APIへのリクエストを行う処理
import type { NarouApiResponse } from "../types/novel.d";

// APIのURL
const API_BASE_URL = 'https://api.syosetu.com/novelapi/api/?out=json&int=200&of=t-w-s';

// 検索パラメータの型定義
export interface SearchParams {
    title?: string;
    writer?: string;
    story?: string;
}

// APIから小説データを取得
export const fetchNovels = async (params: SearchParams): Promise<NarouApiResponse> => {
    const query = new URLSearchParams({
        out: 'json',
        lim: params.limit?.toString() || '200',
        ...params,
    });

    const url = `${API_BASE_URL}?${query}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data: NarouApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('APIリクエストエラー:', error);
        throw error;
    }
};