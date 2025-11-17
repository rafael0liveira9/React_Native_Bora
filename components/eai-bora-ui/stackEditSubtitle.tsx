import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import MFSeparator from "./separator";

interface Props extends ViewProps {
  title?: string;
  themeColors?: any;
  align?: string;
  info?: string;
  isPrimary?: boolean;
}

export default function MFStackEditSubtitle({
  title,
  themeColors,
  align,
  isPrimary,
  info,
}: Props) {
  const [showTip, setShowTip] = useState(false);
  return (
    <View style={styles.container}>
      {align === "right" && (
        <MFSeparator
          width={200}
          height={1}
          color={themeColors.text}
        ></MFSeparator>
      )}
      <Tooltip
        isVisible={showTip}
        content={<Text>{info}</Text>}
        placement="bottom"
        onClose={() => setShowTip(false)}
      >
        <TouchableOpacity onPress={() => setShowTip(true)}>
          <Text
            style={{
              fontSize: 24,
              color: isPrimary ? themeColors.primary : themeColors.text,
              fontWeight: 700,
            }}
          >
            {title}
            {"  "}
            {info && (
              <AntDesign name="infocirlce" size={20} color={themeColors.text} />
            )}
          </Text>
        </TouchableOpacity>
      </Tooltip>
      {align === "left" && (
        <MFSeparator
          width={200}
          height={1}
          color={themeColors.text}
        ></MFSeparator>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 10,
  },
});
