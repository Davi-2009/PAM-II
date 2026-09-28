import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

const API = 'https://pokeapi.co/api/v2';
const OFFICIAL_ART = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const ALOLA_FORMS = [
  'rattata-alola', 'raticate-alola', 'raichu-alola', 'sandshrew-alola',
  'sandslash-alola', 'vulpix-alola', 'ninetales-alola', 'diglett-alola',
  'dugtrio-alola', 'meowth-alola', 'persian-alola', 'geodude-alola',
  'graveler-alola', 'golem-alola', 'grimer-alola', 'muk-alola',
  'exeggutor-alola', 'marowak-alola',
];
const ULTRA_BEASTS = new Set([793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806]);
const STARTERS = new Set([722, 725, 728]);
const TYPE_NAMES = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada',
};
const TYPE_COLORS = {
  normal: '#aab4aa', fire: '#ff875c', water: '#50b9e8', electric: '#f2c94c',
  grass: '#65c58a', ice: '#79d6d1', fighting: '#ed755d', poison: '#bd83d2',
  ground: '#d5a86f', flying: '#8ea9df', psychic: '#e77dac', bug: '#a9bf51',
  rock: '#b79c62', ghost: '#8f83c4', dragon: '#7473da', dark: '#76818f',
  steel: '#8ca5b6', fairy: '#df91b6',
};
const STAT_NAMES = {
  hp: 'HP', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'At. especial', 'special-defense': 'Def. especial', speed: 'Velocidade',
};

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PokéAPI respondeu com ${response.status}`);
  return response.json();
}

function portugueseText(entries, key) {
  const pt = entries?.find((entry) => entry.language?.name === 'pt-br');
  const en = entries?.find((entry) => entry.language?.name === 'en');
  return (pt?.[key] || en?.[key] || '').replace(/[\n\f]/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatName(name) {
  return name
    .replace(/-alola$/, ' de Alola')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase('pt-BR'));
}

function PokemonCard({ pokemon, onPress }) {
  const primaryColor = TYPE_COLORS[pokemon.types[0]] || '#69c6b4';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${pokemon.name}`}
      onPress={() => onPress(pokemon)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.artStage, { backgroundColor: `${primaryColor}20` }]}>
        <Text style={styles.cardDex}>Nº {String(pokemon.dexNumber).padStart(3, '0')}</Text>
        <Image source={{ uri: pokemon.image }} style={styles.cardImage} resizeMode="contain" />
        {pokemon.isUltraBeast && <Text style={styles.rareMark}>UB</Text>}
      </View>
      <View style={styles.cardInfo}>
        <Text numberOfLines={1} style={styles.cardName}>{pokemon.name}</Text>
        <View style={styles.typeRow}>
          {pokemon.types.map((type) => (
            <View key={type} style={[styles.typePill, { backgroundColor: TYPE_COLORS[type] || '#83949b' }]}>
              <Text style={styles.typePillText}>{TYPE_NAMES[type] || type}</Text>
            </View>
          ))}
        </View>
        <Text numberOfLines={2} style={styles.cardDescription}>{pokemon.description || 'Habitante da região tropical de Alola.'}</Text>
        <Text style={styles.regionLabel}>{pokemon.isAlolaForm ? 'FORMA DE ALOLA' : 'REGIÃO DE ALOLA'}</Text>
      </View>
    </Pressable>
  );
}

function PokemonDetails({ pokemon, onClose }) {
  if (!pokemon) return null;
  const maxStat = 255;

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable accessibilityLabel="Fechar detalhes" onPress={onClose} style={StyleSheet.absoluteFill} />
        <ImageBackground
          source={require('../assets/images.jpg')}
          resizeMode="cover"
          imageStyle={styles.detailBackgroundImage}
          style={styles.detailSheet}
        >
          <View pointerEvents="none" style={styles.detailImageOverlay} />
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
            <View style={styles.detailTopline}>
              <Text style={styles.detailDex}>POKÉDEX DE ALOLA · Nº {String(pokemon.dexNumber).padStart(3, '0')}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <View style={styles.detailArtStage}>
              <Image source={{ uri: pokemon.image }} style={styles.detailImage} resizeMode="contain" />
            </View>
            <Text style={styles.detailName}>{pokemon.name}</Text>
            <View style={styles.detailTypes}>
              {pokemon.types.map((type) => (
                <View key={type} style={[styles.detailType, { backgroundColor: TYPE_COLORS[type] || '#83949b' }]}>
                  <Text style={styles.detailTypeText}>{TYPE_NAMES[type] || type}</Text>
                </View>
              ))}
              {pokemon.isUltraBeast && <Text style={styles.ultraLabel}>ULTRA BEAST</Text>}
            </View>
            <Text style={styles.detailDescription}>{pokemon.description || 'Um Pokémon que habita as ilhas de Alola.'}</Text>

            <View style={styles.measureRow}>
              <View style={styles.measureCell}>
                <Text style={styles.measureValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
                <Text style={styles.measureLabel}>ALTURA</Text>
              </View>
              <View style={styles.measureDivider} />
              <View style={styles.measureCell}>
                <Text style={styles.measureValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
                <Text style={styles.measureLabel}>PESO</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.abilityRow}>
              {pokemon.abilities.map((ability) => (
                <View key={ability} style={styles.abilityPill}>
                  <Text style={styles.abilityText}>{formatName(ability)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Estatísticas base</Text>
            {pokemon.stats.map((stat) => (
              <View key={stat.name} style={styles.statLine}>
                <Text style={styles.statName}>{STAT_NAMES[stat.name] || stat.name}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.statTrack}>
                  <View style={[styles.statFill, { width: `${Math.min(stat.value / maxStat * 100, 100)}%` }]} />
                </View>
              </View>
            ))}
          </ScrollView>
        </ImageBackground>
      </View>
    </Modal>
  );
}

export default function Pokedex() {
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 4 : width >= 650 ? 3 : 2;
  const [pokemon, setPokemon] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPokemon() {
    setLoading(true);
    setError('');
    setPokemon([]);
    try {
      const generation = await getJson(`${API}/generation/7/`);
      const catalog = generation.pokemon_species.map((species) => ({
        name: species.name,
        speciesId: Number(species.url.match(/\/pokemon-species\/(\d+)/)?.[1]),
        isAlolaForm: false,
      }));
      ALOLA_FORMS.forEach((name) => {
        catalog.push({ name, isAlolaForm: true });
      });

      for (let index = 0; index < catalog.length; index += 8) {
        const batch = catalog.slice(index, index + 8);
        const loaded = await Promise.allSettled(batch.map(async (entry) => {
          const details = await getJson(`${API}/pokemon/${entry.name}/`);
          const speciesId = entry.speciesId || Number(details.species.url.match(/\/pokemon-species\/(\d+)/)?.[1]);
          const species = await getJson(`${API}/pokemon-species/${speciesId}/`);
          const localizedName = portugueseText(species.names, 'name') || formatName(species.name);
          return {
            apiId: details.id,
            dexNumber: speciesId,
            name: entry.isAlolaForm ? `${localizedName} de Alola` : localizedName,
            searchName: `${species.name} ${details.name} ${localizedName}`.toLocaleLowerCase('pt-BR'),
            image: details.sprites.other?.['official-artwork']?.front_default || `${OFFICIAL_ART}/${details.id}.png`,
            types: details.types.map((type) => type.type.name),
            height: details.height,
            weight: details.weight,
            abilities: details.abilities.map((ability) => ability.ability.name),
            stats: details.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
            description: portugueseText(species.flavor_text_entries, 'flavor_text'),
            isAlolaForm: entry.isAlolaForm,
            isUltraBeast: ULTRA_BEASTS.has(speciesId),
            isStarter: STARTERS.has(speciesId),
          };
        }));
        setPokemon((current) => [
          ...current,
          ...loaded.filter((result) => result.status === 'fulfilled').map((result) => result.value),
        ]);
      }
    } catch (loadError) {
      setError('Não foi possível conectar à PokéAPI. Confira sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPokemon();
  }, []);

  const availableTypes = useMemo(() => [...new Set(pokemon.flatMap((item) => item.types))].sort(), [pokemon]);
  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return pokemon.filter((item) => {
      const normalizedName = item.searchName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const matchesQuery = !normalizedQuery || normalizedName.includes(normalizedQuery) || String(item.dexNumber).includes(normalizedQuery.replace('#', ''));
      const matchesCategory = category === 'todos'
        || (category === 'alola' && item.isAlolaForm)
        || (category === 'iniciais' && item.isStarter)
        || (category === 'ultra' && item.isUltraBeast);
      const matchesType = typeFilter === 'todos' || item.types.includes(typeFilter);
      return matchesQuery && matchesCategory && matchesType;
    });
  }, [pokemon, query, category, typeFilter]);

  const renderHeader = () => (
    <View style={styles.pageHeader}>
      <View style={styles.topline}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>◉</Text></View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>Pokédex</Text>
          <Text style={styles.brandAccent}>REGIONAL ALOLA</Text>
        </View>
        <View style={styles.generationBadge}><Text style={styles.generationNumber}>07</Text><Text style={styles.generationLabel}>GERAÇÃO</Text></View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="Buscar Pokémon por nome ou número"
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar Pokémon ou número..."
            placeholderTextColor="#7c858b"
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {!!query && <Pressable onPress={() => setQuery('')}><Text style={styles.clearSearch}>×</Text></Pressable>}
        </View>
        <View style={styles.dexBadge}><Text style={styles.dexBadgeText}>#</Text></View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.rosterTitle}>Pokémon de Alola</Text>
        <Text style={styles.rosterCount}>{loading ? '···' : `${filteredPokemon.length} REGISTROS`}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          ['todos', 'Todos'], ['alola', 'Formas de Alola'],
          ['iniciais', 'Iniciais'], ['ultra', 'Ultra Beasts'],
        ].map(([value, label]) => (
          <Pressable key={value} onPress={() => setCategory(value)} style={[styles.filterChip, category === value && styles.filterChipActive]}>
            <Text style={[styles.filterText, category === value && styles.filterTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeFilterRow}>
        <Pressable onPress={() => setTypeFilter('todos')} style={[styles.typeFilter, typeFilter === 'todos' && styles.typeFilterActive]}>
          <Text style={[styles.typeFilterText, typeFilter === 'todos' && styles.typeFilterTextActive]}>Todos os tipos</Text>
        </Pressable>
        {availableTypes.map((type) => (
          <Pressable key={type} onPress={() => setTypeFilter(type)} style={[styles.typeFilter, typeFilter === type && styles.typeFilterActive]}>
            <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[type] }]} />
            <Text style={[styles.typeFilterText, typeFilter === type && styles.typeFilterTextActive]}>{TYPE_NAMES[type] || type}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#b90c2c" />
      <FlatList
        key={columns}
        data={filteredPokemon}
        numColumns={columns}
        keyExtractor={(item) => String(item.apiId)}
        renderItem={({ item }) => <View style={[styles.cardSlot, { width: `${100 / columns}%` }]}><PokemonCard pokemon={item} onPress={setSelected} /></View>}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.cardRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            {loading ? <ActivityIndicator size="large" color="#ffc857" /> : <Text style={styles.emptyIcon}>◌</Text>}
            <Text style={styles.emptyTitle}>{error ? 'Sinal perdido' : loading ? 'Carregando registros...' : 'Nenhum registro encontrado'}</Text>
            {!!error && <Pressable onPress={loadPokemon} style={styles.retryButton}><Text style={styles.retryText}>Tentar novamente</Text></Pressable>}
            {!loading && !error && <Text style={styles.emptyText}>Ajuste a busca ou os filtros para continuar explorando.</Text>}
          </View>
        )}
        ListFooterComponent={<Text style={styles.footer}>DADOS E ESTATÍSTICAS · POKÉAPI</Text>}
      />
      <PokemonDetails pokemon={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f2f4' },
  listContent: { paddingBottom: 26, maxWidth: 980, width: '100%', alignSelf: 'center' },
  pageHeader: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#d91035' },
  topline: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.25)', paddingBottom: 10 },
  brandMark: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  brandMarkText: { color: '#d91035', fontSize: 29, fontWeight: '900', lineHeight: 34 },
  brandCopy: { justifyContent: 'center' },
  brandName: { color: '#fff', fontSize: 25, fontWeight: '900' },
  brandAccent: { color: '#ffe3e9', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 1 },
  generationBadge: { marginLeft: 'auto', width: 43, height: 43, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' },
  generationNumber: { color: '#fff', fontSize: 16, fontWeight: '900' },
  generationLabel: { color: '#ffe3e9', fontSize: 6, fontWeight: '800' },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 14 },
  searchBox: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, backgroundColor: '#fff', borderRadius: 25 },
  searchIcon: { color: '#d91035', fontSize: 26, width: 29, lineHeight: 29 },
  searchInput: { flex: 1, color: '#252a30', fontSize: 14, outlineStyle: 'none' },
  clearSearch: { color: '#d91035', fontSize: 22, fontWeight: '700', paddingLeft: 8 },
  dexBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  dexBadgeText: { color: '#d91035', fontSize: 24, fontWeight: '800' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18, marginBottom: 2 },
  rosterTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  rosterCount: { color: '#ffe3e9', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  filterRow: { gap: 7, paddingTop: 9, paddingBottom: 8 },
  filterChip: { paddingHorizontal: 11, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.42)', borderRadius: 18 },
  filterChipActive: { backgroundColor: '#fff', borderColor: '#fff' },
  filterText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  filterTextActive: { color: '#c70d30' },
  typeFilterRow: { gap: 7, paddingBottom: 4 },
  typeFilter: { minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.34)', borderRadius: 15 },
  typeFilterActive: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.18)' },
  typeFilterText: { color: '#ffe5ea', fontSize: 9, fontWeight: '700' },
  typeFilterTextActive: { color: '#fff' },
  typeDot: { width: 7, height: 7, borderRadius: 4 },
  cardRow: {},
  cardSlot: { paddingHorizontal: 5, paddingBottom: 10 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e3e5e8', borderRadius: 13, overflow: 'hidden', height: 274, elevation: 2 },
  cardPressed: { opacity: 0.82, borderColor: '#d91035' },
  artStage: { height: 137, position: 'relative', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardDex: { position: 'absolute', top: 9, right: 10, color: '#737a80', fontSize: 10, fontWeight: '700', zIndex: 1 },
  cardImage: { width: '78%', height: 124 },
  rareMark: { position: 'absolute', left: 9, top: 8, color: '#fff', backgroundColor: '#d91035', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, fontSize: 8, fontWeight: '900' },
  cardInfo: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 8, flex: 1, backgroundColor: '#fff' },
  cardName: { color: '#252a30', fontSize: 14, fontWeight: '800' },
  typeRow: { flexDirection: 'row', gap: 5, marginTop: 6 },
  typePill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9 },
  typePillText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  cardDescription: { color: '#626b73', fontSize: 9, lineHeight: 13, marginTop: 6, flex: 1 },
  regionLabel: { color: '#c70d30', fontSize: 7, fontWeight: '800', letterSpacing: 0.7, marginTop: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 190, padding: 20 },
  emptyIcon: { color: '#d91035', fontSize: 32 },
  emptyTitle: { color: '#30363b', fontSize: 15, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  emptyText: { color: '#747d84', fontSize: 12, textAlign: 'center', marginTop: 7 },
  retryButton: { marginTop: 13, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#d91035', borderRadius: 18 },
  retryText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  footer: { color: '#7c858c', fontSize: 9, fontWeight: '700', textAlign: 'center', letterSpacing: 1, paddingTop: 20, paddingBottom: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(18, 24, 30, 0.48)', justifyContent: 'flex-end' },
  detailSheet: { maxHeight: '92%', backgroundColor: 'transparent', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 22, paddingBottom: 22 },
  sheetHandle: { alignSelf: 'center', width: 38, height: 3, borderRadius: 2, backgroundColor: '#77838a', marginTop: 10, marginBottom: 9 },
  detailContent: { paddingBottom: 20, maxWidth: 580, width: '100%', alignSelf: 'center' },
  detailTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailDex: { color: '#b40b2b', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 16 },
  closeButtonText: { color: '#32383d', fontSize: 25, lineHeight: 29 },
  detailArtStage: { height: 205, alignItems: 'center', justifyContent: 'center', marginTop: 8, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.15)' },
  detailBackgroundImage: { opacity: 0.95 },
  detailImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(248, 250, 252, 0.58)' },
  detailImage: { width: 195, height: 195 },
  detailName: { color: '#20272d', fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 14 },
  detailTypes: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 9 },
  detailType: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 12 },
  detailTypeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  ultraLabel: { color: '#a30d2a', fontSize: 9, fontWeight: '900', marginLeft: 4 },
  detailDescription: { color: '#303940', fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 13 },
  measureRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.76)', borderRadius: 10, marginTop: 18, paddingVertical: 13 },
  measureCell: { flex: 1, alignItems: 'center' },
  measureDivider: { width: 1, backgroundColor: 'rgba(70,80,88,0.2)' },
  measureValue: { color: '#20272d', fontSize: 16, fontWeight: '800' },
  measureLabel: { color: '#6c767d', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  sectionTitle: { color: '#20272d', fontSize: 14, fontWeight: '800', marginTop: 19, marginBottom: 9 },
  abilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  abilityPill: { paddingHorizontal: 9, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.76)', borderWidth: 1, borderColor: 'rgba(70,80,88,0.16)', borderRadius: 12 },
  abilityText: { color: '#303940', fontSize: 10, fontWeight: '700' },
  statLine: { minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statName: { width: 86, color: '#4e5a62', fontSize: 10 },
  statValue: { width: 26, color: '#20272d', fontSize: 10, fontWeight: '800', textAlign: 'right' },
  statTrack: { flex: 1, height: 5, backgroundColor: 'rgba(50,65,74,0.18)', overflow: 'hidden', borderRadius: 3 },
  statFill: { height: '100%', backgroundColor: '#d91035', borderRadius: 3 },
});