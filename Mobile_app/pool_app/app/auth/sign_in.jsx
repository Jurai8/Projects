import { Text, View, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react'


export default function SignIn() {
    const [input, setInput] = useState('')

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <TextInput
                style={styles.input}
                onChangeText={setInput}
                value={input}
            />
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});