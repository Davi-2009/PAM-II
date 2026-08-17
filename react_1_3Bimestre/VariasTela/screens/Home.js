import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';

export default function Home() {
  const usuarios = [
    { id: '1', nome: 'Naruto Uzumaki', rank: 'S', tag: 'Ninja' },
    { id: '2', nome: 'Sakura Haruno', rank: 'A', tag: 'Médica' },
    { id: '3', nome: 'Sasuke Uchiha', rank: 'S', tag: 'Rogue' },
    { id: '4', nome: 'Boruto Uzumaki', rank: 'A', tag: 'Genin' },
    { id: '5', nome: 'Hinata Hyuga', rank: 'A', tag: 'Byakugan' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.eyebrow}>ANIME HUB</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>A</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Olá, otaku!</Text>
        <Text style={styles.title}>Bora explorar</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroTag}>TOP DO MOMENTO</Text>
          <Text style={styles.heroTitle}>Boruto</Text>
          <Text style={styles.heroText}>Aventura, poder e rivalidade em cada batalha.</Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Assistir agora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCardPurple}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>episódios</Text>
          </View>
          <View style={styles.statCardPink}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>favoritos</Text>
          </View>
        </View>

        <View style={styles.listaContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.titulo}>Personagens</Text>
            <Text style={styles.verTodos}>Ver tudo</Text>
          </View>

          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.nome.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.tag}>{item.tag}</Text>
                  </View>
                </View>

                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{item.rank}</Text>
                </View>
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
    backgroundColor: '#2c2c2c',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#dfeafc',
    fontWeight: '700',
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6f8aa8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#f5f9ff',
    fontWeight: '800',
    fontSize: 18,
  },
  greeting: {
    fontSize: 18,
    color: '#edf3ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#f7fbff',
    marginBottom: 22,
  },
  heroCard: {
    backgroundColor: '#3d4758',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#8ea5c2',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#9fb8d8',
    opacity: 0.30,
  },
  heroTag: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#dfeafc',
    fontWeight: '700',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    color: '#dde7f6',
    lineHeight: 22,
    marginBottom: 18,
    maxWidth: 230,
  },
  heroButton: {
    backgroundColor: '#b8c8dd',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#1d2430',
    fontWeight: '800',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCardPurple: {
    flex: 1,
    backgroundColor: '#4d5d73',
    borderRadius: 18,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#a8bfd8',
  },
  statCardPink: {
    flex: 1,
    backgroundColor: '#5d6678',
    borderRadius: 18,
    padding: 16,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#c7d3e6',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    marginTop: 4,
    color: '#edf3ff',
    fontSize: 13,
  },
  listaContainer: {
    backgroundColor: '#38414d',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#a0b4cf',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f7fbff',
  },
  verTodos: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dfeafc',
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4b5868',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#b1c3dc',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dfeafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#1f2d3d',
    fontWeight: '900',
    fontSize: 18,
  },
  nome: {
    fontSize: 16,
    color: '#f3f8ff',
    fontWeight: '700',
  },
  tag: {
    color: '#d9e8ff',
    fontSize: 12,
    marginTop: 4,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e9f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#1d2430',
    fontWeight: '900',
    fontSize: 16,
  },
});