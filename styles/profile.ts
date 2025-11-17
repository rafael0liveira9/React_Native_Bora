import {
  StyleSheet
} from "react-native";

export const profileStyles = StyleSheet.create({
mediaModalContainer: {
              width: "85%",
              minHeight: 250,
              padding: 40,
              backgroundColor: "white",
              borderRadius: 10,
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              gap: 30,
              position: "relative",
    },
    mediaModalCloseButton: {
        position: "absolute",
        top: -10,
        right: -10,
        padding: 1,
        borderRadius: 50,
      },
      mediaModalIcon: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        padding: 20,
          borderRadius: 10,
          position: "relative",
    },
    mediaModalText: {
        position: "absolute",
        top: -5,
        left: -5,
        borderRadius: 30,
        paddingVertical: 1,
        paddingHorizontal: 7
      },
      profileEditBox: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom:20
        }
  });
  