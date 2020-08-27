import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../app.json'
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native';

const styles = StyleSheet.create({
    record: {
        height: 200,
        borderBottomWidth: 1,
        borderColor: "pink",
        padding: 5,
        flexDirection: "row"
    },
    column: {
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    image: {
        flex: 1,
        maxWidth: 100
    },
    line: {
        marginBottom: 1,
        marginLeft: 5,
    },
    errorText: {
        textAlign: "center",
        backgroundColor: "#DFF2BF",
        alignSelf: "stretch"
    }
}
)

interface Response {
    page: number,
    total_pages: 2,
    data: Array<Record>
}
interface Record {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}

const InfiniteScroll = (props: any) => {
    const [data, setData] = useState<Array<Record>>([])
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasFinished, setHasFinished] = useState<boolean>(false)
    const [fetchFailed, setfetchFailed] = useState<boolean>(false)


    const handleFetch = () => {
        setIsLoading(true)
        return fetch(`${fetchAPI}?page=${currentPage + 1 || 1}`)
            .then((res) => { return res.json() })
            .then((res: Response) => {
                const newData: Array<Record> = res.data
                setData([...data, ...newData])
                setTotalPages(res.total_pages)
                setCurrentPage(res.page)
                setIsLoading(false)
            }).catch((error: Error) => {
                setfetchFailed(true)
                setIsLoading(false)
            })
    }

    const onEndReached = () => {
        if (!hasFinished && currentPage >= totalPages) {
            setHasFinished(true)
        }
        if (!hasFinished && !isLoading) {
            handleFetch()
        }
    }

    useEffect(() => {
        handleFetch()
    }, [])

    const _renderRecord = (item: Record) => {
        return (<View style={styles.record}>
            <Image style={styles.image} source={{ uri: item.avatar }} />
            <View style={[styles.column, { flex: 1 }]}>
                <Text style={styles.line}>Name:</Text>
                <Text style={styles.line}>E-mail:</Text>
            </View>
            <View style={[styles.column, { flex: 2 }]}>
                <Text style={styles.line}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.line}>{item.email}</Text>
            </View>
        </View >)
    }
    const _renderFooter = () => {
        if (isLoading) return (<ActivityIndicator color="pink" size="large" />)
        if (hasFinished) return (<Text style={{ alignSelf: "center" }}>No more records to display.</Text>)
        if (fetchFailed) return (<Text style={styles.errorText}>Connection problem.</Text>)
    }
    return (
        <View>
            <FlatList
                data={data}
                renderItem={({ item }) => { return _renderRecord(item) }}
                keyExtractor={item => item.id.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={_renderFooter()}
            />
        </View>
    )
}
export default InfiniteScroll