import { Card, CardHeader, CardBody, Heading, Text, VStack, Link } from '@yamada-ui/react';
import type { Novel } from '../types/novel';

interface Props {
    novels: Novel[];
}

export const NovelList = ({ novels }: Props) => {
    if (novels.length === 0) {
    return <Text>該当する小説はありません。</Text>;
    }

    return (
    <VStack spacing={4} w="full">
        <Text>{novels.length}件の小説が見つかりました。</Text>
        {novels.map((novel, index) => {
        if (!novel || !novel.ncode) {
            return null;
        }

        return (
            <Card key={novel.ncode} variant="outline" w="100%">
            <CardHeader>
                <Heading size="md">
                {/* ncodeを小文字にしてリンクを生成 */}
                <Link href={`https://ncode.syosetu.com/${novel.ncode.toLowerCase()}/`} isExternal>
                    {novel.title ?? 'タイトル不明'}
                </Link>
                </Heading>
                <Text>{novel.writer ?? '作者不明'}</Text>
            </CardHeader>
            <CardBody>
                <Text noOfLines={3}>{novel.story ?? 'あらすじがありません。'}</Text>
            </CardBody>
            </Card>
        );
        })}
    </VStack>
    );
};