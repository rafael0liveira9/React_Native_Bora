import { usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ButtonProps,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MFPrimaryButtonProps extends ButtonProps {
  themeColors?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  isWhiteDetails?: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

interface MFModalButtonProps extends ButtonProps {
  type?: string;
  themeColors?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

interface MFThemeButtonProps extends ButtonProps {
  color?: string;
  type: string;
  icon?: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
}

interface MFFloatButtonProps extends ButtonProps {
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface MFAddFriendProps extends ButtonProps {
  themeColors: any;
  type: number;
  onPress: () => void;
  fullWidth?: boolean;
}

interface MFInfoButtonProps extends ButtonProps {
  themeColors?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  text: string;
  onPress: (event: any) => void;
}

interface TabBarButtonProps {
  route: string;
  color?: string;
  icon?: React.ReactNode;
  themeColors?: any;
  iconActive?: React.ReactNode;
}

export function MFPrimaryButton({
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  isWhiteDetails,
  ...rest
}: MFPrimaryButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? themeColors.disabled
              : themeColors.primary,
            borderColor: isDisabled
              ? themeColors.primaryOpacity
              : isWhiteDetails
              ? themeColors.white
              : themeColors.primary,
            borderWidth: 2,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: 900,
              color:
                isLoading || isDisabled
                  ? themeColors.primaryOpacity
                  : themeColors.white,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={isLoading ? themeColors.primaryOpacity : themeColors.white}
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFSuccessButton({
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  ...rest
}: MFPrimaryButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? themeColors.disabled
              : themeColors.success,
            borderColor: isDisabled ? themeColors.success : themeColors.success,
            borderWidth: 2,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                isLoading || isDisabled ? themeColors.white : themeColors.white,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={isLoading ? themeColors.white : themeColors.white}
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFDefaulButton({
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  ...rest
}: MFPrimaryButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: themeColors.default,
            borderColor: themeColors.default,
            borderWidth: 2,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                isLoading || isDisabled ? themeColors.grey : themeColors.black,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={isLoading ? themeColors.grey : themeColors.black}
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFSecondaryButton({
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  ...rest
}: MFPrimaryButtonProps) {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? themeColors.disabled
              : themeColors.primaryOpacity,
            borderColor: isDisabled
              ? themeColors.white
              : themeColors.primaryOpacity,
            borderWidth: 2,
            borderStyle: "solid",
            paddingVertical: 8,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                isLoading || isDisabled
                  ? themeColors.primaryOpacity
                  : themeColors.white,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={isLoading ? themeColors.primaryOpacity : themeColors.white}
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFModalSmallButton({
  type,
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  ...rest
}: MFModalButtonProps) {
  return (
    <View style={{ minWidth: "30%", paddingHorizontal: 5 }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              type === "1"
                ? themeColors.success
                : type === "2"
                ? themeColors.danger
                : type === "3"
                ? themeColors.warning
                : type === "4"
                ? themeColors.info
                : themeColors.default,
            borderColor:
              type === "1"
                ? themeColors.success
                : type === "2"
                ? themeColors.danger
                : type === "3"
                ? themeColors.warning
                : type === "4"
                ? themeColors.info
                : themeColors.default,
            borderWidth: 2,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              color: themeColors.white,
              textTransform: "uppercase",
              fontSize: 16,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={themeColors.backgroundColor}
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFPrimaryOutlinedButton({
  themeColors,
  isLoading,
  isDisabled,
  title,
  onPress,
  ...rest
}: MFPrimaryButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: themeColors.disabled,
            borderColor: isDisabled
              ? themeColors.primaryOpacity
              : themeColors.primary,
            borderWidth: 1,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled || isLoading}
        {...rest}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: 900,
              color:
                isLoading || isDisabled
                  ? themeColors.primaryOpacity
                  : themeColors.primary,
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator
              color={
                isLoading || isDisabled
                  ? themeColors.primaryOpacity
                  : themeColors.primary
              }
              style={{ paddingRight: 20 }}
            />
          )}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFInfoButton({
  themeColors,
  isDisabled,
  text,
  onPress,
  ...rest
}: MFInfoButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isDisabled}
        {...rest}
      >
        <Text
          style={[
            styles.infoButtonText,
            {
              color: themeColors.info,
            },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MFCustomTabIcon({
  route,
  color,
  icon,
  themeColors,
  iconActive,
}: TabBarButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#FFFFFF00",
      }}
    >
      {isActive ? iconActive : icon}
    </View>
  );
}

export function MFThemeChangeButton({
  color,
  icon,
  type,
  onPress,
}: MFThemeButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.themeChangeBox,
        type === "left"
          ? { justifyContent: "flex-start", borderColor: color }
          : { justifyContent: "flex-end" },
      ]}
      onPress={onPress}
    >
      <View style={[styles.themeChangeBtn, { backgroundColor: color }]}>
        {icon}
      </View>
    </TouchableOpacity>
  );
}

export function MFFloatCircleMainButton({
  color,
  icon,
  onPress,
}: MFFloatButtonProps) {
  return (
    <View style={[styles.floatBtn, { backgroundColor: color }]}>
      {" "}
      <TouchableOpacity style={styles.floatBtnTouch} onPress={onPress}>
        {icon}
      </TouchableOpacity>
    </View>
  );
}

export function MFAddFriendButton({
  themeColors,
  type,
  onPress,
  fullWidth = false,
}: MFAddFriendProps) {
  // Type 1=não amigo 2=amig 3=adicionado 4=pedido recebido
  const [isPressed, setIsPressed] = useState<boolean>(false);

  useEffect(() => {
    setIsPressed(false);
  }, [type]);

  return (
    <TouchableOpacity
      onPress={
        isPressed === true
          ? () => {}
          : () => {
              onPress();
              setIsPressed(true);
            }
      }
      style={{
        ...(fullWidth
          ? { width: "100%" }
          : { position: "absolute", right: 10 }),
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderColor:
          type === 1 || type === 5
            ? themeColors.info
            : type === 2
            ? themeColors.grey
            : type === 3
            ? themeColors.orange
            : themeColors.success,
        backgroundColor:
          type === 1
            ? themeColors.info
            : type === 2
            ? themeColors.grey
            : type === 3
            ? themeColors.grey
            : themeColors.grey,
      }}
    >
      <Text
        style={{
          color:
            type === 1
              ? themeColors.white
              : type === 2
              ? themeColors.text
              : type === 3
              ? themeColors.orange
              : themeColors.success,
          fontWeight: 900,
        }}
      >
        {type === 1 || type === 5
          ? !isPressed
            ? "Adicionar amigo"
            : "Pedido enviado"
          : type === 2
          ? "Amigo"
          : type === 3
          ? !isPressed
            ? "Cancelar solicitação"
            : "Cancelado"
          : type === 4
          ? !isPressed
            ? "Aceitar solicitação"
            : "Solicitação aceita"
          : !isPressed
          ? "Seguir"
          : "Seguindo"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: 600,
  },
  infoButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoButtonText: {
    fontSize: 14,
    fontWeight: 500,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  themeChangeBox: {
    width: 55,
    height: 32,
    borderRadius: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
  },
  themeChangeBtn: {
    width: 30,
    height: 30,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  floatBtn: {
    elevation: 12,
    zIndex: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  floatBtnTouch: {
    width: 100,
    height: 100,
    borderRadius: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
