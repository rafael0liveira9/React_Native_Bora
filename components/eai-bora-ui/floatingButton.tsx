import { useActiveExecution } from "@/context/ActiveExecutionContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FloatingButtonProps {
  executionId: number;
  themeColors: any;
}

export function FloatingContinueTrainingButton({
  executionId,
  themeColors,
}: FloatingButtonProps) {
  const router = useRouter();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePress = () => {
    router.push(`/execution/${executionId}`);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          {
            backgroundColor: themeColors.primary,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <MaterialIcons name="play-arrow" size={28} color={themeColors.white} />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: themeColors.white }]}>
              Continuar Treino
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.white + "CC" }]}>
              Treino em andamento
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Wrapper component que usa o hook e só renderiza se houver execução ativa
export function FloatingContinueTrainingButtonWrapper({
  themeColors,
}: {
  themeColors: any;
}) {
  const { activeExecutionId } = useActiveExecution();

  if (!activeExecutionId) {
    return null;
  }

  return (
    <FloatingContinueTrainingButton
      executionId={activeExecutionId}
      themeColors={themeColors}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 20,
    zIndex: 999,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
  },
});
