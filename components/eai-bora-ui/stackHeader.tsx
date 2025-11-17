import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { globalStyles } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { MFSecondaryButton } from "./buttons";

interface HeaderProps extends ViewProps {
  title?: string;
  titleBtn?: string;
  isLoading?: boolean;
  replace?: any;
  onPress?: any;
  openTrainingInfo?: () => void;
}

export default function MFStackHeader({
  title,
  isLoading,
  titleBtn,
  replace,
  onPress,
  openTrainingInfo,
}: HeaderProps) {
  const router = useRouter(),
    { theme } = useTheme(),
    themeColors = Colors[`${theme}`];

  return (
    <View
      style={[
        globalStyles.stackHeader,
        { backgroundColor: themeColors.primary },
      ]}
    >
      <View style={globalStyles.stackBackButton}>
        <TouchableOpacity
          onPress={
            replace ? () => router.replace(replace) : () => router.back()
          }
        >
          <AntDesign name="arrowleft" size={24} color={themeColors.white} />
        </TouchableOpacity>
        <Pressable onPress={openTrainingInfo ? openTrainingInfo : () => {}}>
          <Text
            style={{ color: themeColors.white, fontSize: 24, fontWeight: 600 }}
          >
            {title}
          </Text>
        </Pressable>
      </View>
      {onPress && (
        <MFSecondaryButton
          isDisabled={isLoading}
          isLoading={isLoading}
          themeColors={themeColors}
          title={titleBtn ? titleBtn : "Salvar"}
          onPress={onPress}
        ></MFSecondaryButton>
      )}
    </View>
  );
}
