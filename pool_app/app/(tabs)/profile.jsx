import { Text, View, StyleSheet } from 'react-native';
import Button from '@/components/Button';


export default function Profile() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}> Profile page</Text>
        <View>
          <Button label='Sign in'/>
          <Button label='Sign up'/>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
})