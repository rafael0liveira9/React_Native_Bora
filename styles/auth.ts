import {
  StyleSheet
} from "react-native";

export const authStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#101010",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      gap: 10,
      paddingBottom: 40
    },
    box: {
      width: "100%",
      backgroundColor: "#1a1a1a",
      padding: 24,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      paddingBottom: 40,
      display: 'flex',
      alignItems:'center',
      justifyContent:'center'
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "#aaa",
      marginBottom: 24,
    },
    input: {
      backgroundColor: "#2a2a2a",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      fontSize: 16,
      color: "#fff",
      marginBottom: 16,
    },
    button: {
      backgroundColor: "#4f46e5",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
  },
  imageBox: {
    width: '100%',
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    display: 'flex',
    // borderWidth: 1,
    // borderColor: 'black',
    // borderStyle:'solid'
  },
  mflogo: {
    objectFit: 'contain',
    width: 90
  }
  });
  