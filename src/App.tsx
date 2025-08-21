//メインコンポーネント
import { useState, useEffect } from 'react';
import { UIProvider, Container, VStack, Heading, Loading, Center, Text, HStack } from '@yamada-ui/react';
import { SearchForm } from './components/SearchForm';
import { NovelList} from './components/NovelList';
import type { Novel, NarouApiResponse } from './types/novel';

const API_URL = 'https://api.syosetu.com/novelapi/api/?out=json&of=t-w-s-n&lim=200';

interface SearchCriteria {
    title: string;
    story: string;
}

function App() {
    const [allNovels, setAllNovels] = useState<Novel[]>([]);
    const [displayedNovels, setDisplayedNovels] = useState<Novel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`(HTTPエラー: ${response.status})`);

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

    const handleSearch = (criteria: SearchCriteria) => {
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

    return (
        <UIProvider>
            <Container maxW="full" px="lg" py="lg">
                <VStack spacing="lg">
                    <Heading>小説検索</Heading>
                    <HStack spacing="lg" align="start" w="full">
                        <VStack w="30%" minW="300px" position="sticky" top="lg">
                            <SearchForm onSearch={handleSearch} />
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