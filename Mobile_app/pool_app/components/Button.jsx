import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';



const authNavigate = (label, router) => {
  if (label === "Sign in") {
    router.navigate('auth/sign_in')
  } else if (label === "Sign up") {
    router.navigate('auth/sign_up')
  }
}
export default function Button({ label }) {

  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} 
        onPress={() => authNavigate(label, router)}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}





const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});