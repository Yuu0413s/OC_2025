//検索機能のコンポーネント
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useSimilaritySearch } from '../hooks/useSimilaritySearch';
import { Input, Button, VStack, Text, FormControl, Loading, Label, Center } from '@yamada-ui/react';
import { NovelList } from './NovelList';

export const SearchForm = () => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [story, setStory] = useState('');

    const [isSearchPerformed, setIsSearchPerformed] = useState(false);

    const { novels, isLoading, error, searchNovels } = useSimilaritySearch();

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearchPerformed(true);
        searchNovels({ title, writer, story });
    };

    const handleFetchRecommendedList = () => {
        setTitle('');
        setWriter('');
        setStory('');
        setIsSearchPerformed(true);
        searchNovels({ title, writer, story });
    };

    return (
    <VStack spacing={6} align="stretch">
        <form onSubmit={handleSearch}>
            <VStack spacing={4} p={4} borderWidth={1} borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">詳細検索</Text>
            <FormControl>
            <Label>タイトル</Label>
            <Input
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="タイトルで検索"
                disabled={isLoading}
            />
            </FormControl>

            <FormControl>
            <Label>作者</Label>
            <Input
                value={writer}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setWriter(e.target.value)}
                placeholder="作者名で検索"
                disabled={isLoading}
            />
            </FormControl>

            <FormControl>
            <Label>あらすじ</Label>
            <Input
                value={story}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStory(e.target.value)}
                placeholder="あらすじで検索"
                disabled={isLoading}
            />
            </FormControl>
            <Button type="submit" w="full" colorScheme="primary" disabled={isLoading}>
                この条件で検索
            </Button>
        </VStack>
        </form>

        <Button onClick={handleFetchRecommendedList} w="full" colorScheme="secondary" disabled={isLoading}>
            おすすめリストを表示
        </Button>

        {isLoading && <Center><Loading /></Center>}
        {error && <Text color="red.500">{error.message}</Text>}
        {!isLoading && isSearchPerformed && (
        <Text>{novels.length}件の小説が見つかりました。</Text>
        )}
        {!isLoading && novels.length > 0 && <NovelList novels={novels} />}
    </VStack>
    );
};