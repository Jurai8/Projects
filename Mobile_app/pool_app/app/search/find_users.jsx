import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import api from '../api/axios';


export default function UserSearch() {

    const [username,setUsername] = useState('')
    const [Error, setError] = useState(false);


    async function findUser(username) {

        try {
            const response = await api.post('api/search/', {
                username: username,
            })

            console.log(response.data)
            return response.data
        } catch (error) {
            console.error(error)
            setError(error)
        }
        
    }

    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder='Search for a user'
            />

            <Pressable 
                style={styles.button}
                onPress={async () => {await findUser(username)}}
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