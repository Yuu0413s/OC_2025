//カスタムフック
import { useState, useCallback } from 'react';
import { fetchNovels } from '../utils/api';
import type { SearchParams } from '../utils/api';
import type { Novel, NarouApiResponse } from '../types/novel';

//入力値をまとめる型定義
export interface SearchCriteria {
    title?: string;
    writer?: string;
    story?: string;
}

//検索機能を提供するカスタムフック
export const useSimilaritySearch = () => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const searchNovels = useCallback(async (criteria: SearchCriteria) => {
        const { title, writer, story } = criteria;

        if (!title?.trim() && !writer?.trim() && !story?.trim()) {
            setError(new Error('少なくとも1つの検索条件を指定してください'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setNovels([]);

        try {
            const apiQueryWord = title?.trim() || writer?.trim || story?.trim();

            const apiParams: SearchParams = { word: apiQueryWord, limit: 50 };

            const response: NarouApiResponse = await fetchNovels(apiParams);

            const [, ...novelData] = response;
            let fetchedNovels: Novel[] = novelData;

            if (title?.trim()) {
                const lowerCaseWriter = title.trim().toLowerCase();
                fetchedNovels = fetchedNovels.filter(novel =>
                    novel.writer.toLowerCase().includes(lowerCaseWriter)
                );
            }

            if (story?.trim()) {
                const lowerCaseStory = story.trim().toLowerCase();
                fetchedNovels = fetchedNovels.filter(novel =>
                    novel.story.toLowerCase().includes(lowerCaseStory)
                );
            }

            setNovels(fetchedNovels);

        } catch (err) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error('予期しないエラーが発生しました'));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { novels, isLoading, error, searchNovels };
};