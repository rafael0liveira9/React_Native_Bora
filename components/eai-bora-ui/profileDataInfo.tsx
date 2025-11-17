import { calculateAge, getGender } from "@/controllers/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { MFPrimaryButton } from "./buttons";

import { User } from "@/model/user";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

interface MFDefaultCardProps extends ViewProps {
  isLoading?: boolean;
  themeColors?: any;
  photoOpen?: () => void;
  backOpen?: () => void;
  user?: User;
  setMediaType?: () => void;
}

export default function MFProfileDataCard({
  isLoading,
  themeColors,
  photoOpen,
  backOpen,
  user,
}: MFDefaultCardProps) {
  const router = useRouter();
  const [imcomplete, setImcomplete] = useState<boolean>(false);

  useEffect(() => {
    if (
      !user?.email ||
      !user?.client?.name ||
      !user?.client?.nick ||
      !user?.client?.description ||
      !user?.client?.phone ||
      !user?.client?.objective ||
      !user?.client?.gender ||
      !user?.client?.birthDate
    ) {
      setImcomplete(true);
    }
  }, [user]);

  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
          backgroundColor: themeColors.background,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.title}
        onPress={() => router.push("/(stack)/profile/edit")}
      >
        <Text
          style={{ fontWeight: 600, fontSize: 30, color: themeColors.text }}
        >
          {user?.client?.name}{" "}
          {user?.client?.nick && user?.client?.nick !== user?.client?.name && (
            <Text
              style={{ fontWeight: 500, fontSize: 20, color: themeColors.text }}
            >
              ({user?.client?.nick})
            </Text>
          )}
        </Text>
        <View
          style={[
            styles.editIcon,
            {
              backgroundColor: themeColors.secondary,
              shadowColor: themeColors.text,
            },
          ]}
        >
          <Feather name="edit" size={12} color={themeColors.text} />
        </View>
      </TouchableOpacity>
      <View style={styles.box}>
        {user?.client?.birthDate && (
          <View style={styles.boxContent}>
            <Fontisto name="date" size={18} color={themeColors.text} />
            <Text
              style={{ fontWeight: 600, fontSize: 18, color: themeColors.text }}
            >
              Idade: {calculateAge(user?.client?.birthDate)}
            </Text>
          </View>
        )}
        {user?.client?.gender && (
          <View style={styles.boxContent}>
            <FontAwesome name="user" size={18} color={themeColors.text} />
            <Text
              style={{ fontWeight: 600, fontSize: 18, color: themeColors.text }}
            >
              Gênero: {getGender(user?.client?.gender)}
            </Text>
          </View>
        )}
        {user?.client?.phone && (
          <View style={styles.boxContent}>
            <FontAwesome name="whatsapp" size={18} color={themeColors.text} />
            <Text
              style={{ fontWeight: 600, fontSize: 18, color: themeColors.text }}
            >
              Whatsapp: {user?.client?.phone}
            </Text>
          </View>
        )}
        <View style={styles.boxContent}>
          <Fontisto name="email" size={18} color={themeColors.text} />
          <Text
            style={{ fontWeight: 600, fontSize: 18, color: themeColors.text }}
          >
            E-mail: {user?.email}
          </Text>
        </View>
        {user?.client?.instagram && (
          <View style={styles.boxContent}>
            <AntDesign name="instagram" size={18} color={themeColors.text} />
            <Text
              style={{ fontWeight: 600, fontSize: 18, color: themeColors.text }}
            >
              Instagram: {user?.client?.instagram}
            </Text>
          </View>
        )}
        {user?.client?.description && (
          <View style={styles.boxContent}>
            <AntDesign name="infocirlceo" size={18} color={themeColors.text} />
            <Text
              style={{ fontWeight: 500, fontSize: 17, color: themeColors.text }}
            >
              Sobre: {user?.client?.description}
            </Text>
          </View>
        )}
        <View style={[styles.editBoxButton]}>
          {imcomplete && (
            <Text
              style={{
                fontWeight: 400,
                fontSize: 13,
                color: themeColors.primary,
              }}
            >
              *Precisa completar cadastro.
            </Text>
          )}
          <MFPrimaryButton
            title="Editar dados"
            onPress={() => router.push("/(stack)/profile/edit")}
            isLoading={isLoading}
            isDisabled={isLoading}
            themeColors={themeColors}
            isWhiteDetails={true}
          ></MFPrimaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  editIcon: {
    padding: 2,
    borderRadius: 50,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 0,
    paddingHorizontal: 20,
  },
  boxContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingTop: 8,
  },
  editBoxButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingTop: 30,
    width: "100%",
  },
});
