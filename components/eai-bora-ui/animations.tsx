import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

let trigger: () => void;

export function showConfetti() {
  if (trigger) trigger();
}

export function ConfettiOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    trigger = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("@/assets/success_confetti.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "transparent",
    zIndex: 9999,
    pointerEvents: "none",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});
