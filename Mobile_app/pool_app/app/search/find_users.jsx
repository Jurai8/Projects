import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import api from '../api/axios';


export default function UserSearch() {

    const [username,setUsername] = useState('');
    const [Error, setError] = useState(false);
    const [ShowUsers, setShowUsers] = useState(false);
    const [Users, setUsers] = useState(false);


    async function findUser(username) {
        
        try {
            const response = await api.get('api/search/', {
                params: {
                    username: username,
                }
            })

            setUsers(response.data.users)
        } catch (error) {
            console.error(error)
            setError(error)
        }
        
    }

    useEffect(() => {

        console.log("running....")

        if (Users) {
            setShowUsers(true)

            console.log("set show users to true")
        }
        

    }, [Users]);


    // get user info
        // send the request
        // get the data
        // send it through the url to profile
        

    return (

        ShowUsers ? (
            <View style={styles.container}>
                <Text styles={{fontSize: 20,}}>
                    {`Results for the search "${username}"`}</Text>
                <ul>
                    {Users.map(user => (
                        <li key={user.username}>
                            {user.username} 
                        </li>
                    ))}
                </ul>
            </View>
        ) : (
            <View style={styles.container}>
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