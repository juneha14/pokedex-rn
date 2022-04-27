import React from "react";
import {
  Pressable,
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
} from "react-native";
import { useRouteNavigation, useRouteParams } from "../../navigation/useRoutes";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing } from "../../utils/theme";
import { TagList } from "../../components/TagList";
import { getColorForAttribute } from "../../utils/getColorForAttribute";

export const PokemonDetailsScreen = () => {
  const {
    params: { imgUri, name },
  } = useRouteParams("PokemonDetails");

  return (
    <>
      <NavigationBackButton />

      <ScrollView>
        <Header imgUri={imgUri} name={name} id="1" />
        <View
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -30,
            paddingTop: 30,
            paddingHorizontal: Spacing.defaultMargin,
            backgroundColor: Colors.SurfaceBackground,
          }}
        >
          <View>
            <Text>About</Text>
          </View>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </>
  );
};

const Section = () => {
  return (
    <View>
      <View />
    </View>
  );
};

const NavigationBackButton = () => {
  const { pop } = useRouteNavigation();
  const { top, left } = useSafeAreaInsets();

  return (
    <Pressable
      style={{
        position: "absolute",
        top,
        left: left + 10,
        zIndex: 1,
      }}
      onPress={() => pop()}
    >
      <Ionicons name="ios-arrow-back" size={26} color={Colors.IconNeutral} />
    </Pressable>
  );
};

const Header = ({
  imgUri,
  name,
  id,
}: {
  imgUri: string;
  id: string;
  name: string;
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: top + 50,
        paddingBottom: 30,
        paddingHorizontal: Spacing.defaultMargin,
        backgroundColor: "pink",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: 30,
              fontWeight: "700",
              color: Colors.TextOnSurfacePrimary,
            }}
          >
            {name}
          </Text>
          <TagList
            style={{ marginTop: Spacing.m }}
            tags={[
              { title: "Grass", color: getColorForAttribute("grass") },
              {
                title: "Poison",
                color: getColorForAttribute("poison"),
              },
            ]}
          />
        </View>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            marginBottom: Spacing.m,
          }}
        >
          {`#${String(id).padStart(3, "0")}`}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: Spacing.m,
        }}
      >
        <Image
          source={{ uri: imgUri }}
          style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const IMG_WIDTH = Dimensions.get("window").width;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
