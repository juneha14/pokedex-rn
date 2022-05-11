import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Section } from "../../../components/Section";
import { Stat } from "../../../models/server";
import { Colors, Spacing } from "../../../utils/theme";
import { clamp } from "../../../utils/redash";

export const Stats = ({ stats }: { stats: Stat[] }) => {
  return (
    <Section title="Base Stats" style={{ marginTop: Spacing.xl }}>
      {stats.map(({ stat, base_stat }) => {
        return <StatRow key={stat.name} name={stat.name} value={base_stat} />;
      })}
    </Section>
  );
};

const StatRow = ({ name, value }: { name: string; value: number }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.m,
        marginHorizontal: Spacing.s,
      }}
    >
      <Text style={{ flex: 1, color: Colors.TextSubdued, fontSize: 16 }}>
        {localizedStatName[name]}
      </Text>
      <View
        style={{
          flexGrow: 3,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: Colors.BorderSubdued,
        }}
      >
        <StatIndicator value={clamp(value, 0, 100)} />
      </View>
    </View>
  );
};

const StatIndicator = ({ value }: { value: number }) => {
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(-500);

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    if (width > 0) {
      const percentage = value / 100;
      const normalized = width * (1 - percentage);
      translateX.value = withDelay(
        200,
        withSequence(
          withTiming(-width, { duration: 0 }),
          withTiming(0 - normalized, { duration: 2000 })
        )
      );
    }
  }, [translateX, value, width]);

  return (
    <Animated.View
      style={[
        {
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: Spacing.m,
          paddingVertical: 1,
          borderRadius: 10,
          backgroundColor: colorForStat(value),
        },
        aStyle,
      ]}
      onLayout={(e) => {
        if (width === 0) {
          setWidth(e.nativeEvent.layout.width);
        }
      }}
    >
      <Text>{value.toString()}</Text>
    </Animated.View>
  );
};

const localizedStatName: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP-ATK",
  "special-defense": "SP-DEF",
  speed: "SPD",
  total: "TOT",
};

const colorForStat = (stat: number) => {
  if (stat <= 50) {
    return Colors.SurfaceCritical;
  } else if (stat > 50 && stat < 80) {
    return Colors.SurfaceWarning;
  } else {
    return Colors.SurfaceSuccess;
  }
};
