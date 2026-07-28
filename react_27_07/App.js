import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, Image, TextInput, Button, View } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        <View style={styles.card}>
        <Image
          style={styles.image}
          source={{ uri: 'https://cdn.meutimao.com.br/_upload/torcida-do-corinthians/2024/01/13/carlos_roberto_pinheiro_vieira_oyh.jpg' }}
          resizeMode="cover"
        />
        <Text style={styles.imageName}>Carlinhos</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Dê sua nota" />
          <View style={styles.buttonWrapper}>
            <Button title="Enviar" onPress={() => {}} />
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG2jkrWke6AfFah8NMdAYPCgKRPBtV9ogiej_c638hNJ2YL-xqYR3jptNu&s=10' }}
          resizeMode="cover"
        />
        <Text style={styles.imageName}>Mario Jogos</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Dê sua nota" />
          <View style={styles.buttonWrapper}>
            <Button title="Enviar" onPress={() => {}} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6gcJg2J4NQ_EmO_WWnwGz-OQVssSvrWM88RWgcrK9JysY97_muYpgyk5N&s=10' }}
          resizeMode="cover"
        />
        <Text style={styles.imageName}>Jesus pedindo </Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="Dê sua nota" />
          <View style={styles.buttonWrapper}>
            <Button title="Enviar" onPress={() => {}} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #2193b0 0%, #ffffff 100%)',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
  },
  imageName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});