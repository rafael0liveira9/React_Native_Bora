import { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface MFDefaultCardProps extends ViewProps {
  themeColors?: any;
  children: ReactNode;
  withoutPadding?: boolean;
}

export function MFDefaultCard({
  themeColors,
  children,
  style,
  withoutPadding,
  ...props
}: MFDefaultCardProps) {
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: themeColors.secondary,
          shadowColor: themeColors.text,
        },
        withoutPadding && { padding: 0, paddingBottom: 0 },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function MFDefaultNoPadCard({
  themeColors,
  children,
  style,
  ...props
}: MFDefaultCardProps) {
  return (
    <View
      style={[
        styles.boxWhitoutPadding,
        {
          backgroundColor: themeColors.secondary,
          shadowColor: themeColors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: "100%",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    paddingBottom: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  boxWhitoutPadding: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
