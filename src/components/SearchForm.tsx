import React, { useState } from 'react';
import { Box, Button, Input, Textarea, VStack, Text, Loading, Alert, AlertIcon } from '@yamada-ui/react';
import { useSimilaritySearch } from '../useSimilaritySearch';
import NovelList from './NovelList';

interface Novel {
    title: string;
    writer: string;
    story: string;
}

interface SimilarityResult extends Novel {
    similarity: number;
}

const SearchForm = () => {
    const { loading, error, search } = useSimilaritySearch();

    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [searchResults, setSearchResults] = useState<SimilarityResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !story || isSearching) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
        const results = await search(title, story);
        setSearchResults(results);
    } catch (err) {
        console.error('検索中にエラーが発生しました:', err);
    } finally {
        setIsSearching(false);
    }
    };

  // 全体ロード時のスピナー表示
    if (loading) {
    return (
        <Box textAlign="center" py="10">
        <Loading size="lg" />
        <Text mt="2">モデルと小説データをロード中...</Text>
        </Box>
    );
    }

  // エラー表示
    if (error) {
    return (
        <Alert status="error">
        <AlertIcon />
        データのロードに失敗しました: {error}
        </Alert>
    );
    }

    return (
        <Box p="6" borderWidth="1px" borderRadius="lg" shadow="md" w="100%" maxW="800px" mx="auto">
        <VStack as="form" spacing="4" onSubmit={handleSearch}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            類似作品を検索
        </Text>

        <Input
            placeholder="検索したい作品のタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
        />
        <Textarea
            placeholder="検索したい作品のあらすじ"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={6}
            required
        />

        <Button
            type="submit"
            colorScheme="blue"
          isLoading={isSearching} // ここでローディング状態をコントロール
            loadingText="検索中..."
            w="full"
        >
            検索を実行
        </Button>
        </VStack>

    {/* 検索結果の表示 */}
        {!isSearching && <NovelList results={searchResults} />}
    </Box>
    );
};

export default SearchForm;