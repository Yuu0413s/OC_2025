import { useState, useEffect } from 'react';
import { UIProvider, Container, VStack, Heading, Center, Text, Loading, HStack } from "@yamada-ui/react";
import { SearchForm } from "./components/SearchForm";
import { NovelList } from "./components/NovelList";
import type { Novel, NarouApiResponse, NovelWithScore } from './types/novel';

const API_URL = 'https://api.syosetu.com/novelapi/api/?out=json&of=n-t-w-s&lim=200';

// 検索条件の型を定義
interface FilterCriteria {
    query: string;
    author: string;
}

function App() {
    const [allNovels, setAllNovels] = useState<Novel[]>([]);
    const [displayedNovels, setDisplayedNovels] = useState<NovelWithScore[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchAllData = async () => {
        try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        const data: NarouApiResponse = await response.json();
        const [, ...novelData] = data;

        setAllNovels(novelData);
        setDisplayedNovels(novelData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('不明なエラーが発生しました'));
        } finally {
            setIsLoading(false);
        }
    };
    fetchAllData();
    }, []);

    const handleFilterSearch = (criteria: FilterCriteria) => {
    const { query, author } = criteria;
    const lowerCaseQuery = query.toLowerCase().trim();
    const lowerCaseAuthor = author.toLowerCase().trim();

    if (!lowerCaseQuery && !lowerCaseAuthor) {
        setDisplayedNovels(allNovels);
        return;
    }

    const filteredNovels = allNovels.filter(novel => {
        const matchesQuery = !lowerCaseQuery ||
            (novel.title?.toLowerCase() || '').includes(lowerCaseQuery) ||
            (novel.story?.toLowerCase() || '').includes(lowerCaseQuery);

        const matchesAuthor = !lowerCaseAuthor ||
            (novel.writer?.toLowerCase() || '').includes(lowerCaseAuthor);

        return matchesQuery && matchesAuthor;
    });

    setDisplayedNovels(filteredNovels);
    };

    const handleSimilaritySearch = (query: string) => {
    if (!query.trim()) {
        setDisplayedNovels(allNovels);
        return;
    }

        const queryWords = new Set(query.toLowerCase().match(/\w+/g) || []);
        const scoredNovels: NovelWithScore[] = allNovels.map(novel => {
        const novelText = `${novel.title} ${novel.story}`;
        const novelWords = new Set(novelText.toLowerCase().match(/\w+/g) || []);

        const intersection = new Set([...queryWords].filter(word => novelWords.has(word)));
        const union = new Set([...queryWords, ...novelWords]);
        const score = union.size > 0 ? intersection.size / union.size : 0;

        return { ...novel, score };
    });

    const topNovels = scoredNovels
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 10);

    setDisplayedNovels(topNovels);
    };

    return (
    <UIProvider>
        <Container maxW="full" px="lg" py="lg">
            <VStack spacing="lg">
                <Heading>小説検索&推薦</Heading>
                <HStack spacing="lg" align="start" w="full">
                    <VStack w="30%" minW="300px" position="sticky" top="lg">
                        <SearchForm
                            onFilterSearch={handleFilterSearch}
                            onSimilaritySearch={handleSimilaritySearch}
                        />
                    </VStack>

                    <VStack w="70%">
                        {isLoading && <Center><Loading /></Center>}
                        {error && <Text color="red.500">{error.message}</Text>}
                        {!isLoading && <NovelList novels={displayedNovels} />}
                    </VStack>
                </HStack>
            </VStack>
        </Container>
    </UIProvider>
    );
}

export default App;