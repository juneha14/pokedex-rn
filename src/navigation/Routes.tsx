import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PokemonListScreen from "../screens/PokemonList";

type StackRouteParamList = {
  PokemonList: undefined;
  PokemonDetails: undefined;
};

const Stack = createStackNavigator<StackRouteParamList>();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PokemonList" component={PokemonListScreen} />
        <Stack.Screen name="PokemonDetails" component={PokemonListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
