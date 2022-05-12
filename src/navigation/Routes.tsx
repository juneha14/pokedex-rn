import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import PokemonListScreen from "../screens/PokemonList";
import PokemonDetailsScreen from "../screens/PokemonDetails";
import { Type } from "../models/server";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { Easing } from "react-native";

export type StackRouteParamList = {
  PokemonList: undefined;
  PokemonDetails: {
    imgUri: string;
    name: string;
    id: number;
    attributes: Type[];
  };
};

export type Screens = keyof StackRouteParamList;

const Stack = createSharedElementStackNavigator<StackRouteParamList>();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PokemonList" component={PokemonListScreen} />
        <Stack.Screen
          name="PokemonDetails"
          component={PokemonDetailsScreen}
          options={{
            transitionSpec: {
              open: {
                animation: "spring",
                config: { tension: 30 },
              },
              close: {
                animation: "timing",
                config: { easing: Easing.ease, duration: 300 },
              },
            },
            gestureEnabled: false,
            cardStyleInterpolator: ({ current }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      scale: current.progress.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                      }),
                    },
                  ],
                  opacity: current.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  }),
                },
              };
            },
          }}
          initialParams={{
            imgUri: "",
            name: "",
            id: 0,
            attributes: [],
          }}
          sharedElements={(route) => {
            const { id, imgUri } = route.params;
            return [{ id: `${id}.${imgUri}`, animation: "fade" }];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
