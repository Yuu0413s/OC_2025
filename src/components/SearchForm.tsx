//検索機能のコンポーネント
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Input, Button, VStack, FormControl } from '@yamada-ui/react';

interface Props {
    onSearch: (query: string) => void;
}

export const SearchForm = ({ onSearch }: Props) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <VStack as="form" onSubmit={handleSubmit} w="full">
            <FormControl>
                <Input
                    type="search"
                    placeholder="リスト内を検索"
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                />
            </FormControl>
            <Button type="submit" colorScheme="primary" w="full">
                検索
            </Button>
        </VStack>
    );
};