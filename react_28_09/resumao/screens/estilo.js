import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  imagem: {
    width: 120,
    height: 120,
    marginBottom: 25,
    resizeMode: 'contain',
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 25,
    textAlign: 'center',
  },

  texto: {
    fontSize: 16,
    color: '#222222',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
    color: '#222222',
  },

  botao: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },

  login: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    marginTop: 10,
  },

  cadastro: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default estilos;