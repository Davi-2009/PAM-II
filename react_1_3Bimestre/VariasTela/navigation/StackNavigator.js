import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Home from '../screens/Home';

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
          name="Home"
          component={Home}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}