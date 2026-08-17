import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';

export default function Home() {
  const usuarios = [
    { id: '1', nome: 'Ixicu Kunosaco' },
    { id: '2', nome: 'Sarada Quembate' },
    { id: '3', nome: '"GIGA CHAD" Sadomasoquista' },
    { id: '4', nome: 'Iurrabarra' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Olá, usuário!</Text>
        <Text style={styles.title}>Home</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do dia</Text>
          <Text style={styles.cardText}>Você tem algum personagem favoritos?</Text>
        </View>

        <View style={styles.listaContainer}>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>Lista melhores personagens de BORUTO:</Text>

          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.nome}>{item.nome}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  greeting: {
    fontSize: 18,
    color: '#4f46e5',
    fontWeight: '600',
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  listaContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nome: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  itemValue: {
    fontSize: 13,
    color: '#e0e7ff',
  },
});