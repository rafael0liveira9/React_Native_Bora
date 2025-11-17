import { ActivityIndicator, Image, View } from "react-native";

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF3131",
        paddingBottom: 100,
      }}
    >
      <Image
        style={{
          width: 120,
          height: 120,
          objectFit: "contain",
        }}
        source={require(`@/assets/images/eai-bora/logo/eai_bora_v_br.png`)}
      />
      <ActivityIndicator size={40} color="#ffffff" />
    </View>
  );
}
