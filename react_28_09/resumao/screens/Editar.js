import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase/firebase';

import estilos from './estilo';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function fazerLogin() {
    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
      Alert.alert(
        'Atenção',
        'Digite o e-mail e a senha.'
      );
      return;
    }

    try {
      // Faz login usando Firebase Authentication
      await signInWithEmailAndPassword(auth, email, senha);

      // Login realizado com sucesso
      navigation.navigate('Home');

    } catch (error) {
      console.log(error);

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        Alert.alert(
          'Erro',
          'E-mail ou senha incorretos.'
        );

      } else if (error.code === 'auth/invalid-email') {
        Alert.alert(
          'Erro',
          'Digite um e-mail válido.'
        );

      } else {
        Alert.alert(
          'Erro',
          'Não foi possível realizar o login.'
        );
      }
    }
  }

  return (
    <View style={estilos.container}>
      <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
        }}
        style={estilos.imagem}
      />

      <Text style={estilos.texto}>
        Digite o e-mail
      </Text>

      <TextInput
        placeholder="fulano@hotmail.com"
        style={estilos.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={estilos.texto}>
        Senha
      </Text>

      <TextInput
        placeholder="abc@123"
        secureTextEntry={true}
        style={estilos.input}
        value={senha}
        onChangeText={setSenha}
      />

      <View style={estilos.botao}>
        <Button
          title="Entrar"
          onPress={fazerLogin}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={estilos.cadastro}>
          Não possui uma conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}