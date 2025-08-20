//メインコンポーネント
import { useState, useEffect } from 'react';
import { UIProvider, Container, VStack, Heading, Loading, Center, Text } from '@yamada-ui/react';
import { SearchForm } from './components/SearchForm';
import { NovelList} from './components/NovelList';
import type { Novel, NarouApiResponse } from './types/novel';

const API_URL = 'https://api.syosetu.com/novelapi/api/?out=json&int=200&of=t-w-s';

function App() {
    const [allNovels, setAllNovels] = useState<Novel[]>([]);
    const [displayedNovels, setDisplayedNovels] = useState<Novel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('HTTPエラー: $(response.status)')

                    const  data: NarouApiResponse = await response.json();
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

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setDisplayedNovels(allNovels);
            return;
        }
        const lowerCaseQuery = query.toLowerCase();

        const filtered = allNovels.filter(novel =>
            novel.title.toLowerCase().includes(lowerCaseQuery) ||
            novel.story.toLowerCase().includes(lowerCaseQuery)
        );
        setDisplayedNovels(filtered);
    };

    return (
        <UIProvider>
            <Container maxW="3xl" py="lg">
                <VStack spacing="lg">
                    <Heading>小説検索</Heading>
                    <SearchForm onSearch={handleSearch} />

                    {isLoading && <Center><Loading /></Center>}
                    {error && <Text color="red.500">{error.message}</Text>}
                    {!isLoading && <NovelList novels={displayedNovels} />}
                </VStack>
            </Container>
        </UIProvider>
    );
}

export default App;