import { User } from "@/model/user";
import Feather from "@expo/vector-icons/Feather";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  useWindowDimensions,
} from "react-native";

interface MFDefaultCardProps extends ViewProps {
  isLoading?: boolean;
  themeColors?: any;
  photoOpen?: () => void;
  backOpen?: () => void;
  user?: User;
  setMediaType?: () => void;
}

export default function MFProfileCard({
  isLoading,
  themeColors,
  photoOpen,
  backOpen,
  user,
}: MFDefaultCardProps) {
  const { width } = useWindowDimensions();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
        },
      ]}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: themeColors.secondary,
            shadowColor: themeColors.text,
          },
        ]}
      >
        <ImageBackground
          source={
            user?.client?.backgroundImage
              ? { uri: user?.client?.backgroundImage }
              : require("@/assets/images/eai-bora/eab-background-default.png")
          }
          style={[styles.top, { backgroundColor: themeColors.primary }]}
          imageStyle={{
            resizeMode: "cover",
            width: width,
            height: "100%",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={backOpen}
            style={[
              styles.imageEdit,
              { backgroundColor: "#fff", top: 10, right: 10 },
            ]}
          >
            <Feather name="edit" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={photoOpen}
            style={[styles.imageBox, { backgroundColor: "#fff" }]}
          >
            {user?.client?.photo ? (
              <Image
                source={{ uri: user?.client?.photo }}
                style={styles.photo}
              />
            ) : (
              <View
                style={[
                  styles.photo,
                  { backgroundColor: themeColors.primaryContrast },
                ]}
              >
                {isLoading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size={20} color={themeColors.primary} />
                  </View>
                ) : (
                  <Text style={{ fontSize: 40, color: "#fff" }}>
                    {user?.client?.name?.charAt(0).toUpperCase() ?? "?"}
                  </Text>
                )}
              </View>
            )}
            <View style={[styles.imageEdit, { backgroundColor: "#fff" }]}>
              <Feather name="edit" size={18} color="black" />
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
  top: {
    width: "100%",
    height: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    margin: 0,
    padding: 0,
    paddingHorizontal: 18,
  },
  bottom: {
    width: "100%",
    position: "relative",
    minHeight: 150,
    height: "auto",
  },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 110,
    marginBottom: -25,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9,
    padding: 6,
    position: "relative",
  },
  imageEdit: {
    width: 25,
    height: 25,
    borderRadius: 30,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    position: "absolute",
    top: 3,
    right: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 98,
    height: 98,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
