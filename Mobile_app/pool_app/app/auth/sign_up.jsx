import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react'
import { Button } from '@react-navigation/elements';


export default function SignUp() {
    const [input, setInput] = useState('')

    const createAccount = (data) => {
        alert(data)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <TextInput
                style={styles.input}
                onChangeText={setInput}
                value={input}
                placeholder="Username"
            />

            <TextInput
                style={styles.input}
                onChangeText={setInput}
                value={input}
                placeholder="Password"
            />

            <Pressable 
                style={styles.button}
                onPress={() => {createAccount(input)}}
            >
                <Text>Submit</Text>
            </Pressable>
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
    },

    button: {
        width: 100,
        height: 50,
        borderRadius: 10,
        borderColor: '#712626ff',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});