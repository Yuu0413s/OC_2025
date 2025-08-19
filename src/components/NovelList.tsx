//類似小説のリストを表示するコンポーネント
import type { Novel } from '../types/novel';
import { Card, CardHeader, Heading, VStack, Link, CardBody, Text } from '@yamada-ui/react'

interface Props {
    novels: Novel[];
}

export const NovelList = ({ novels }: Props) => {
    if (novels.length === 0) {
        return null;
    }

    return (
        <VStack gap={4}>
            {novels.map((novel) => (
                <Card as='li' key={novel.ncode} variant="outline" w="100%">
                    <CardHeader>
                        <Heading size="md">
                            <Link href={`https://ncode.syosetu.com/${novel.ncode.toLowerCase()}`} isExternal>
                                {novel.title}
                            </Link>
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{novel.story}</Text>
                    </CardBody>
                </Card>
            ))}
        </VStack>
    );
};