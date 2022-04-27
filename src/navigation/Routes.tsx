import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PokemonListScreen from "../screens/PokemonList";
import PokemonDetailsScreen from "../screens/PokemonDetails";

export type StackRouteParamList = {
  PokemonList: undefined;
  PokemonDetails: {
    imgUri: string;
    name: string;
  };
};

export type Screens = keyof StackRouteParamList;

const Stack = createStackNavigator<StackRouteParamList>();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PokemonList" component={PokemonListScreen} />
        <Stack.Screen name="PokemonDetails" component={PokemonDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
