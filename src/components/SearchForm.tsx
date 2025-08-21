//検索機能のコンポーネント
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Input, Button, VStack, FormControl, Text } from '@yamada-ui/react';

interface Props {
    onSearch: (criteria: { query: string; author: string }) => void;
}

export const SearchForm = ({ onSearch }: Props) => {
    const [query, setQuery] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch({ query, author });
    };

    return (
    <VStack as="form" onSubmit={handleSubmit} w="full" spacing={4}>
        <FormControl>
        <Text as="label">キーワード検索</Text>
        <Input
            type="search"
            placeholder="タイトル・あらすじ"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        </FormControl>
        <FormControl>
        <Text as="label">作者検索</Text>
        <Input
            type="search"
            placeholder="作者名"
            value={author}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
        />
        </FormControl>
        <Button type="submit" colorScheme="primary" w="full">
            検索
        </Button>
    </VStack>
    );
};