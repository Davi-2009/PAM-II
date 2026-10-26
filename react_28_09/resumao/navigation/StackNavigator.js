import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Pokedex from '../screens/Pokedex';
import Cadastro from '../screens/Cadastro';
import Editar from '../screens/Editar';
import HomeAntigo from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={Login}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
        />

        <Stack.Screen
          name="HomeAntigo"
          component={HomeAntigo}
        />


        <Stack.Screen
          name="Editar"
          component={Editar}
          options={{ title: 'Editar Pokémon' }}
        />

        <Stack.Screen
          name="Home"
          component={Pokedex}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Pokedex"
          component={Pokedex}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}