//処理中であることをユーザーに示すためのスピナー
import React from 'react';
import { Spinner, Center } from '@yamada-ui/react';

const { screen, page, background } = useLoading()

return (
    <Wrap gap="md">
        <Button
        onClick={() =>
            screen.start({
            message: <Text color="primary">Loading</Text>,
            duration: 5000,
            })
        }
        >
        Start screen loading
        </Button>
        <Button
        onClick={() =>
            page.start({
            message: <Text color="primary">Loading</Text>,
            duration: 5000,
            })
        }
        >
        Start page loading
        </Button>
        <Button
        onClick={() =>
            background.start({
            message: <Text color="primary">Loading</Text>,
            duration: 5000,
            })
        }
        >
        Start background loading
        </Button>
    </Wrap>
)