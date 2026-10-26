import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  imagem: {
    width: 112,
    height: 112,
    marginBottom: 22,
    resizeMode: 'contain',
  },

  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#252a30',
    marginBottom: 24,
    textAlign: 'center',
  },

  texto: {
    width: '100%',
    maxWidth: 420,
    fontSize: 13,
    fontWeight: '700',
    color: '#252a30',
    marginBottom: 7,
    textAlign: 'left',
  },

  input: {
    width: '100%',
    maxWidth: 420,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#dfe2e5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18,
    color: '#252a30',
    fontSize: 15,
  },

  botao: {
    width: '100%',
    maxWidth: 420,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },

  login: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c70d30',
    textAlign: 'center',
    marginTop: 10,
  },

  cadastro: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c70d30',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default estilos;