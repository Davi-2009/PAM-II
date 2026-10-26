import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Editar({ navigation }) {
  const [nomeDocumento, setNomeDocumento] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const documento = nomeDocumento.trim();
    const nome = novoNome.trim();

    if (!documento || !nome) {
      Alert.alert('Atenção', 'Informe o nome do documento e o novo nome do Pokémon.');
      return;
    }

    setSalvando(true);
    try {
      const referencia = doc(db, 'pokemon', documento);
      const registro = await getDoc(referencia);

      if (!registro.exists()) {
        Alert.alert('Não encontrado', 'Não existe Pokémon com esse nome de documento.');
        return;
      }

      await setDoc(referencia, {
        ...registro.data(),
        nome,
        nomeBusca: `${nome} ${documento}`.toLocaleLowerCase('pt-BR'),
      }, { merge: true });

      Alert.alert('Sucesso', 'Pokémon atualizado.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (erro) {
      console.log('Erro ao editar Pokémon:', erro);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Pokémon</Text>
      <Text style={styles.label}>Nome do documento</Text>
      <TextInput
        value={nomeDocumento}
        onChangeText={setNomeDocumento}
        placeholder="Ex: pikachu"
        autoCapitalize="none"
        style={styles.input}
      />
      <Text style={styles.label}>Novo nome exibido</Text>
      <TextInput
        value={novoNome}
        onChangeText={setNovoNome}
        placeholder="Novo nome"
        style={styles.input}
      />
      <Pressable disabled={salvando} onPress={salvar} style={styles.botao}>
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f2f4', padding: 24, justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: '900', color: '#252a30', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '700', color: '#252a30', marginBottom: 7 },
  input: { height: 48, borderWidth: 1, borderColor: '#dfe2e5', borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 15, marginBottom: 18 },
  botao: { height: 50, borderRadius: 8, backgroundColor: '#c70d30', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '800' },
});