import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';

export default function Home() {
  const usuarios = [
    { id: '1', nome: 'Ichigo Kurosaki', rank: 'SS', tag: 'Zangetsu' },
    { id: '2', nome: 'Rukia Kuchiki', rank: 'S', tag: 'Sode no Shirayuki' },
    { id: '3', nome: 'Orihime Inoue', rank: 'A', tag: 'Shun Shun Rikka' },
    { id: '4', nome: 'Byakuya Kuchiki', rank: 'S', tag: 'Senbonzakura' },
    { id: '5', nome: 'Kenpachi Zaraki', rank: 'SS', tag: 'Nozarashi' },
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
          <Text style={styles.heroTitle}>Bleach</Text>
          <Text style={styles.heroText}>Ichigo Kurosaki é um jovem estudante que consegue ver fantasmas e ganha poderes de um Shinigami (Deus da Morte) para proteger sua família e manter o equilíbrio entre os mundos.</Text>

          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Assistir agora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCardPurple}>
            <Text style={styles.statNumber}>366</Text>
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
    backgroundColor: '#111827',
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
    color: '#dbeafe',
    fontWeight: '700',
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 18,
  },
  greeting: {
    fontSize: 18,
    color: '#e5f0ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#f8fbff',
    marginBottom: 22,
  },
  heroCard: {
    backgroundColor: '#1f2a3a',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#7dd3fc',
    overflow: 'hidden',
    shadowColor: '#7dd3fc',
    shadowOpacity: 0.20,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#7dd3fc',
    opacity: 0.25,
  },
  heroTag: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#bfdbfe',
    fontWeight: '700',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#f8fbff',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    color: '#dfeafc',
    lineHeight: 22,
    marginBottom: 18,
    maxWidth: 260,
  },
  heroButton: {
    backgroundColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#111827',
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
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#7dd3fc',
  },
  statCardPink: {
    flex: 1,
    backgroundColor: '#312e81',
    borderRadius: 18,
    padding: 16,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f8fafc',
  },
  statLabel: {
    marginTop: 4,
    color: '#dbeafe',
    fontSize: 13,
  },
  listaContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#93c5fd',
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
    backgroundColor: '#334155',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
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
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 18,
  },
  nome: {
    fontSize: 16,
    color: '#f8fbff',
    fontWeight: '700',
  },
  tag: {
    color: '#dbeafe',
    fontSize: 12,
    marginTop: 4,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 16,
  },
});