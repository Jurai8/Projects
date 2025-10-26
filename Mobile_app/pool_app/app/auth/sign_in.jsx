import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    }
});


export default function SignIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signIn = async(username, password) => {
        console.log(username, password)
        const response = await api.post('api/signin/', {
            username: username,
            password: password
        })

        // store the token
        const token = response.data.token

        localStorage.setItem('token', token)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder='username'
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder='password'
            />
            <Pressable 
                style={styles.button}
                onPress={async () => {await signIn(username,password)}}
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