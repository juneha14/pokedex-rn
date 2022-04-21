import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql-pokeapi.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  );
}

const POKEMON_LIST = gql`
  query PokemonList {
    pokemons {
      status
      message
      results {
        id
        name
        artwork
      }
    }
  }
`;

const Content = () => {
  const { loading, error, data } = useQuery(POKEMON_LIST);
  console.log("==== Value of data:", data);

  return (
    <View style={styles.container}>
      {loading ? <Text>Loading...</Text> : <Text>{JSON.stringify(data)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
