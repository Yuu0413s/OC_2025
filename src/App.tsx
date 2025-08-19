//メインコンポーネント
import { Container, Heading, UIProvider, VStack } from "@yamada-ui/react"
import { SearchForm } from "./components/SearchForm"

function App() {
    return (
    <UIProvider>
        <Container maxW="3xl" py="lg">
        <VStack spacing="lg">
            <Heading>なろう小説検索</Heading>
            <SearchForm />
        </VStack>
        </Container>
    </UIProvider>
    )
}

export default App