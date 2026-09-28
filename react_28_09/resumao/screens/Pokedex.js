import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
        <View style={styles.detailSheet}>
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
        </View>
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
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>A</Text></View>
        <Text style={styles.brandName}>FIELD GUIDE <Text style={styles.brandAccent}>/ ALOLA</Text></Text>
        <View style={styles.liveIndicator}><View style={styles.liveDot} /><Text style={styles.liveText}>POKÉDEX ONLINE</Text></View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>ARQUIPÉLAGO · PACÍFICO</Text>
          <Text style={styles.title}>{'Pokédex\n'}<Text style={styles.titleAccent}>Alola</Text></Text>
          <Text style={styles.heroDescription}>Uma jornada pelas quatro ilhas, seus Pokémon e as formas que só existem sob o sol de Alola.</Text>
          <View style={styles.generationTag}><Text style={styles.generationTagText}>7ª GERAÇÃO</Text><View style={styles.tagDivider} /><Text style={styles.generationTagText}>2016</Text></View>
        </View>
        <View style={styles.heroVisual}>
          <View style={styles.sunDisc} />
          <Image source={{ uri: `${OFFICIAL_ART}/722.png` }} style={styles.heroPokemon} resizeMode="contain" />
          <Text style={styles.heroCaption}>ROWLET · #722</Text>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionKicker}>REGISTROS DE CAMPO</Text>
          <Text style={styles.rosterTitle}>Habitantes de Alola</Text>
        </View>
        <Text style={styles.rosterCount}>{loading ? '···' : `${filteredPokemon.length} / ${pokemon.length}`}</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Buscar Pokémon por nome ou número"
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar Pokémon ou número..."
          placeholderTextColor="#8da3a5"
          style={styles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {!!query && <Pressable onPress={() => setQuery('')}><Text style={styles.clearSearch}>LIMPAR</Text></Pressable>}
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
      <StatusBar barStyle="light-content" backgroundColor="#081c22" />
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
  screen: { flex: 1, backgroundColor: '#081c22' },
  listContent: { paddingBottom: 26, paddingHorizontal: 18, maxWidth: 1240, width: '100%', alignSelf: 'center' },
  pageHeader: { paddingTop: 18 },
  topline: { height: 42, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#234047', paddingBottom: 12 },
  brandMark: { width: 27, height: 27, borderRadius: 14, backgroundColor: '#f7b84b', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  brandMarkText: { color: '#10272b', fontSize: 15, fontWeight: '900' },
  brandName: { color: '#e7f1e8', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  brandAccent: { color: '#80c9ad' },
  liveIndicator: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7bd6a5' },
  liveText: { color: '#a5b7b2', fontSize: 9, fontWeight: '700' },
  hero: { minHeight: 280, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#234047', overflow: 'hidden' },
  heroCopy: { flex: 1, paddingTop: 25, paddingBottom: 26, zIndex: 1 },
  eyebrow: { color: '#f4bf5e', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#f0f4e9', fontSize: 46, lineHeight: 48, fontWeight: '900', marginTop: 12 },
  titleAccent: { color: '#85d1b1' },
  heroDescription: { color: '#b4c8c3', fontSize: 13, lineHeight: 20, maxWidth: 420, marginTop: 13 },
  generationTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 18, paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#43625e' },
  generationTagText: { color: '#dbe7d8', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  tagDivider: { width: 1, height: 12, marginHorizontal: 9, backgroundColor: '#607a70' },
  heroVisual: { width: '43%', height: 250, alignItems: 'center', justifyContent: 'center' },
  sunDisc: { position: 'absolute', width: 205, height: 205, borderRadius: 110, backgroundColor: '#f0a84b', opacity: 0.14, borderWidth: 1, borderColor: '#f0bd66' },
  heroPokemon: { width: '100%', height: 205, zIndex: 1 },
  heroCaption: { color: '#c3d4c5', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: -3 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25, marginBottom: 14 },
  sectionKicker: { color: '#76c3a7', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  rosterTitle: { color: '#f0f4e9', fontSize: 23, fontWeight: '800', marginTop: 4 },
  rosterCount: { color: '#a9bfba', fontSize: 12, fontWeight: '700', paddingBottom: 4 },
  searchBox: { height: 46, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, backgroundColor: '#10282e', borderWidth: 1, borderColor: '#315159' },
  searchIcon: { color: '#f1bf5b', fontSize: 23, width: 27, lineHeight: 26 },
  searchInput: { flex: 1, color: '#f0f4e9', fontSize: 13, outlineStyle: 'none' },
  clearSearch: { color: '#87cfb2', fontSize: 9, fontWeight: '800', paddingLeft: 8 },
  filterRow: { gap: 8, paddingTop: 13, paddingBottom: 10 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#10282e', borderWidth: 1, borderColor: '#315159' },
  filterChipActive: { backgroundColor: '#d9a749', borderColor: '#d9a749' },
  filterText: { color: '#bfd0ca', fontSize: 11, fontWeight: '700' },
  filterTextActive: { color: '#142a2c' },
  typeFilterRow: { gap: 7, paddingBottom: 16 },
  typeFilter: { minHeight: 28, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, borderWidth: 1, borderColor: '#28464c' },
  typeFilterActive: { borderColor: '#84c9ab', backgroundColor: '#15372f' },
  typeFilterText: { color: '#aebfba', fontSize: 10, fontWeight: '700' },
  typeFilterTextActive: { color: '#d6f0d9' },
  typeDot: { width: 7, height: 7, borderRadius: 4 },
  cardRow: {},
  cardSlot: { paddingHorizontal: 5, paddingBottom: 10 },
  card: { backgroundColor: '#10282e', borderWidth: 1, borderColor: '#24464c', overflow: 'hidden', height: 286 },
  cardPressed: { opacity: 0.78, borderColor: '#83c7a9' },
  artStage: { height: 143, position: 'relative', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardDex: { position: 'absolute', top: 10, left: 10, color: '#d5e2d7', fontSize: 9, fontWeight: '800', zIndex: 1 },
  cardImage: { width: '78%', height: 128 },
  rareMark: { position: 'absolute', right: 9, top: 8, color: '#10272b', backgroundColor: '#f2bd58', paddingHorizontal: 5, paddingVertical: 3, fontSize: 8, fontWeight: '900' },
  cardInfo: { paddingHorizontal: 11, paddingTop: 9, paddingBottom: 8, flex: 1 },
  cardName: { color: '#f1f3e9', fontSize: 15, fontWeight: '800' },
  typeRow: { flexDirection: 'row', gap: 5, marginTop: 6 },
  typePill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 2 },
  typePillText: { color: '#102329', fontSize: 8, fontWeight: '900' },
  cardDescription: { color: '#aebfba', fontSize: 10, lineHeight: 14, marginTop: 7, flex: 1 },
  regionLabel: { color: '#70b99e', fontSize: 8, fontWeight: '800', letterSpacing: 0.8, marginTop: 5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 190, padding: 20 },
  emptyIcon: { color: '#f1bd59', fontSize: 32 },
  emptyTitle: { color: '#e4eee5', fontSize: 15, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  emptyText: { color: '#9db2ad', fontSize: 12, textAlign: 'center', marginTop: 7 },
  retryButton: { marginTop: 13, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#d9a749' },
  retryText: { color: '#142a2c', fontSize: 11, fontWeight: '800' },
  footer: { color: '#718b88', fontSize: 9, fontWeight: '700', textAlign: 'center', letterSpacing: 1, paddingTop: 20, paddingBottom: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(1, 11, 14, 0.78)', justifyContent: 'flex-end' },
  detailSheet: { maxHeight: '92%', backgroundColor: '#0c2329', borderTopWidth: 1, borderColor: '#51746d', paddingHorizontal: 22, paddingBottom: 22 },
  sheetHandle: { alignSelf: 'center', width: 38, height: 3, borderRadius: 2, backgroundColor: '#61807a', marginTop: 10, marginBottom: 9 },
  detailContent: { paddingBottom: 20, maxWidth: 580, width: '100%', alignSelf: 'center' },
  detailTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailDex: { color: '#82c9ab', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#17353a' },
  closeButtonText: { color: '#e3eee4', fontSize: 25, lineHeight: 29 },
  detailArtStage: { height: 205, alignItems: 'center', justifyContent: 'center', marginTop: 8, backgroundColor: '#143139' },
  detailImage: { width: 195, height: 195 },
  detailName: { color: '#f2f3e9', fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 14 },
  detailTypes: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 9 },
  detailType: { paddingHorizontal: 11, paddingVertical: 5 },
  detailTypeText: { color: '#14272a', fontSize: 10, fontWeight: '900' },
  ultraLabel: { color: '#f4c25d', fontSize: 9, fontWeight: '900', marginLeft: 4 },
  detailDescription: { color: '#b8c9c1', fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 13 },
  measureRow: { flexDirection: 'row', backgroundColor: '#122d33', marginTop: 18, paddingVertical: 13 },
  measureCell: { flex: 1, alignItems: 'center' },
  measureDivider: { width: 1, backgroundColor: '#35534f' },
  measureValue: { color: '#edf2e7', fontSize: 16, fontWeight: '800' },
  measureLabel: { color: '#88a29a', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  sectionTitle: { color: '#eaf0e5', fontSize: 14, fontWeight: '800', marginTop: 19, marginBottom: 9 },
  abilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  abilityPill: { paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderColor: '#385a56' },
  abilityText: { color: '#c2d4ca', fontSize: 10, fontWeight: '700' },
  statLine: { minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statName: { width: 86, color: '#9fb5ad', fontSize: 10 },
  statValue: { width: 26, color: '#e8eee3', fontSize: 10, fontWeight: '800', textAlign: 'right' },
  statTrack: { flex: 1, height: 5, backgroundColor: '#203a3d', overflow: 'hidden' },
  statFill: { height: '100%', backgroundColor: '#e6b44d' },
});