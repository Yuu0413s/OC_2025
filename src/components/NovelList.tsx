//類似小説のリストを表示するコンポーネント
import React from 'react';
import { Box, VStack, Text } from '@yamada-ui/react';

// 小説データの型定義（SearchForm.tsxと共有）
interface Novel {
    title: string;
    writer: string;
    story: string;
    }

// 類似度検索結果の型定義（SearchForm.tsxと共有）
interface SimilarityResult extends Novel {
    similarity: number;
}

// propsの型定義
interface NovelListProps {
    results: SimilarityResult[];
}

const NovelList: React.FC<NovelListProps> = ({ results }) => {
  // 結果が空の場合は何も表示しない
    if (results.length === 0) {
    return null;
    }

    return (
    <Box mt="6" w="100%" maxW="800px" mx="auto">
        <Text fontSize="xl" fontWeight="bold">類似作品トップ5</Text>
        <VStack spacing="4" mt="4">
        {results.map((novel, index) => (
            <Box key={index} p="4" borderWidth="1px" borderRadius="md" w="full" shadow="sm">
            <Text fontWeight="bold">
                {index + 1}. {novel.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
                作者: {novel.writer}
            </Text>
            <Text fontSize="sm" color="gray.600">
                類似度: {novel.similarity.toFixed(4)}
            </Text>
            <Text mt="2" fontSize="sm">
                {novel.story.substring(0, 150)}...
            </Text>
            </Box>
        ))}
        </VStack>
    </Box>
    );
};

export default NovelList;