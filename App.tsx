import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PokemonListScreen from "./src/screens/PokemonList";

const client = new ApolloClient({
  uri: "https://graphql-pokeapi.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PokemonListScreen />
    </ApolloProvider>
  );
}
