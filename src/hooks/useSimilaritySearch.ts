//カスタムフック
import { useState, useCallback } from 'react';
import { fetchNovels, SearchParams } from '../utils/api';
import  { Novel } from '../types/novel.d';

//検索機能を提供するカスタムフック
export const useSimilaritySearch = () => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const searchNovels = useCallback(async (params: SearchParams) => {
        setIsLoading(true);
        setError(null);
        setNovels([]);

        try {
            const response = await fetchNovels(params);

            const [, ...novelData] = response;
            setNovels(novelData)

        } catch (err) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error('不明なエラーが発生しました'));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { novels, isLoading, error, searchNovels };
};