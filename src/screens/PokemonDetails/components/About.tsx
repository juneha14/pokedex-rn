import React from "react";
import { View, Text } from "react-native";
import { Section } from "../../../components/Section";
import { Ability } from "../../../models/server";
import { Colors, Spacing } from "../../../utils/theme";

export const About = ({
  height,
  weight,
  abilities,
}: {
  height: number;
  weight: number;
  abilities: Ability[];
}) => {
  return (
    <Section title="About">
      <Text style={{ fontSize: 14, marginBottom: Spacing.l }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
      {/* TODO: figure out unit conversion */}
      <AboutRow title="Height" value={height.toString()} />
      <AboutRow title="Weight" value={weight.toString()} />
      <AboutRow
        title="Abilities"
        value={abilities.map((a) => a.ability.name).join(", ")}
      />
    </Section>
  );
};

const AboutRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: Spacing.s,
        paddingVertical: Spacing.m,
      }}
    >
      <Text style={{ flex: 1, color: Colors.TextSubdued, fontSize: 16 }}>
        {title}
      </Text>
      <Text style={{ flex: 3, fontSize: 16, textTransform: "capitalize" }}>
        {value}
      </Text>
    </View>
  );
};
