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

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../firebase/firebase';

import estilos from './estilo';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  async function cadastrar() {
    // Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.'
      );
      return;
    }

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'As senhas não são iguais.'
      );
      return;
    }

    try {
      // Cria o usuário no Firebase Authentication
      const usuarioCriado = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      // Pega o ID único do usuário
      const uid = usuarioCriado.user.uid;

      // Salva os dados do usuário no Firestore
      await setDoc(
        doc(db, 'usuarios', uid),
        {
          nome: nome,
          email: email,
        }
      );

      // Cadastro concluído: volta para o Login
      navigation.navigate('Login');

    } catch (error) {
      console.log(error);

      // E-mail já cadastrado
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Erro',
          'Este e-mail já está cadastrado.'
        );
      }

      // E-mail inválido
      else if (error.code === 'auth/invalid-email') {
        Alert.alert(
          'Erro',
          'Digite um e-mail válido.'
        );
      }

      // Senha fraca
      else if (error.code === 'auth/weak-password') {
        Alert.alert(
          'Erro',
          'A senha precisa ter pelo menos 6 caracteres.'
        );
      }

      // Outros erros
      else {
        Alert.alert(
          'Erro',
          'Não foi possível realizar o cadastro.'
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

      <Text style={estilos.titulo}>
        Criar uma conta
      </Text>

      <Text style={estilos.texto}>
        Nome
      </Text>

      <TextInput
        placeholder="Digite seu nome"
        style={estilos.input}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={estilos.texto}>
        E-mail
      </Text>

      <TextInput
        placeholder="fulano@hotmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={estilos.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={estilos.texto}>
        Senha
      </Text>

      <TextInput
        placeholder="Digite sua senha"
        secureTextEntry={true}
        style={estilos.input}
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={estilos.texto}>
        Confirmar senha
      </Text>

      <TextInput
        placeholder="Digite a senha novamente"
        secureTextEntry={true}
        style={estilos.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <View style={estilos.botao}>
        <Button
          title="Cadastrar"
          onPress={cadastrar}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={estilos.login}>
          Já possui uma conta? Entrar
        </Text>
      </TouchableOpacity>

    </View>
  );
}