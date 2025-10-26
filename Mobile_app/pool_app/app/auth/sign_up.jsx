import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react'
import { Button } from '@react-navigation/elements';
import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    }
});


export default function SignUp() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const createAccount = async (username, email, password) => {
        const response = await api.post('/api/signup/', {
            username: username,
            email: email,
            password: password
        })

        // set the token
        localStorage.setItem('token', response.data.token)
        
        alert(response.data)
        return response.data
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
            />

            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
            />

            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
            />

            <Pressable 
                style={styles.button}
                onPress={async () => {await createAccount(username,email,password)}}
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