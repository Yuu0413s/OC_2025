//APIへのリクエストを行う処理
import type { NarouApiResponse } from "../types/novel";

const API_BASE_URL = 'https://api.syosetu.com/novelapi/api/?out=json&int=200&of=t-w-s';

export interface SearchParams {
    title?: string;
    writer?: string;
    story?: string;
}

//なろうAPIから小説データを取得する
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
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: NarouApiResponse = await response.json();
    return data;
    } catch (error) {
    console.error('Failed to fetch novels:', error);
    throw error;
    }
};