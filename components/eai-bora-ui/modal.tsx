import { profileStyles } from "@/styles/profile";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { MFModalSmallButton } from "./buttons";
import { MFDefaultCard } from "./baseCards";
import { MFTextInput } from "./inputs";

interface MFLoginProps extends ViewProps {
  warningVisible?: boolean;
  themeColors?: any;
  text?: string;
  isLoading?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  close: () => void;
}

interface MFSingleInputProps extends ViewProps {
  themeColors?: any;
  isOPen?: boolean;
  isLoading?: boolean;
  title?: string;
  inputLabel?: string;
  button1?: string;
  button2?: string;
  data?: string;
  onChange?: (string: string) => void;
  onPress?: (e: GestureResponderEvent) => void;
  close?: (e: GestureResponderEvent) => void;
  icon?: React.ReactNode;
  iconLabel?: React.ReactNode;
}

interface MFCreateStepProps extends ViewProps {
  themeColors?: any;
  isOPen?: boolean;
  isLoading?: boolean;
  inputLabel?: any;
  button1?: any;
  button2?: any;
  title?: string;
  onPress?: (e: GestureResponderEvent) => void;
  close?: (e: GestureResponderEvent) => void;
  name?: string;
  setName?: (string: string) => void;
  description?: string;
  setDescription?: (string: string) => void;
}

interface MFMediaSelectorProps extends ViewProps {
  mediaSelectorVisible: boolean;
  isLoading: boolean;
  themeColors: any;
  close?: (e: GestureResponderEvent) => void;
  openCamera?: () => void;
  pickImage?: () => void;
}

export function MFLogoutModal({
  warningVisible,
  themeColors,
  text,
  onPress,
  close,
  isLoading,
  ...props
}: MFLoginProps) {
  return (
    <Modal
      visible={warningVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={close}
    >
      <View style={styles.container}>
        <MFDefaultCard themeColors={themeColors}>
          <Text
            style={[
              styles.text,
              { color: themeColors.text, textAlign: "center" },
            ]}
          >
            {text}
          </Text>
          <View style={styles.btnBox}>
            {!isLoading && (
              <>
                <MFModalSmallButton
                  type="1"
                  title="SIM"
                  themeColors={themeColors}
                  onPress={onPress!}
                  isLoading={isLoading}
                />
                <MFModalSmallButton
                  type="2"
                  title="Não"
                  themeColors={themeColors}
                  onPress={close!}
                  isLoading={isLoading}
                />
              </>
            )}
            {isLoading && (
              <MFModalSmallButton
                type="3"
                title=" "
                themeColors={themeColors}
                onPress={() => {}}
                isLoading={isLoading}
              />
            )}
          </View>
        </MFDefaultCard>
      </View>
    </Modal>
  );
}

export function MediaSelectorModal({
  mediaSelectorVisible,
  close,
  isLoading,
  themeColors,
  openCamera,
  pickImage,
}: MFMediaSelectorProps) {
  return (
    <Modal
      visible={mediaSelectorVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={close}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        {isLoading ? (
          <View
            style={[
              profileStyles.mediaModalContainer,
              {
                backgroundColor: themeColors.white,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <ActivityIndicator size={20} color={themeColors.primary} />
          </View>
        ) : (
          <View
            style={[
              profileStyles.mediaModalContainer,
              { backgroundColor: themeColors.white },
            ]}
          >
            <TouchableOpacity
              onPress={close}
              style={[
                profileStyles.mediaModalCloseButton,
                { backgroundColor: themeColors.white },
              ]}
            >
              <AntDesign name="closecircle" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openCamera}
              style={[
                profileStyles.mediaModalIcon,
                { backgroundColor: themeColors.grey },
              ]}
            >
              <Text
                style={[
                  profileStyles.mediaModalText,
                  {
                    backgroundColor: themeColors.primary,
                    color: themeColors.white,
                  },
                ]}
              >
                Foto
              </Text>
              <Feather name="camera" size={60} color={themeColors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              style={[
                profileStyles.mediaModalIcon,
                { backgroundColor: themeColors.grey },
              ]}
            >
              <Text
                style={[
                  profileStyles.mediaModalText,
                  {
                    backgroundColor: themeColors.primary,
                    color: themeColors.white,
                  },
                ]}
              >
                Galeria
              </Text>
              <Feather name="image" size={60} color={themeColors.black} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

export function MFSingleInputModal({
  isOPen,
  themeColors,
  title,
  inputLabel,
  data,
  button1,
  button2,
  onChange,
  onPress,
  close,
  icon,
  iconLabel,
  isLoading,
  ...props
}: MFSingleInputProps) {
  return (
    <Modal
      visible={isOPen}
      animationType="slide"
      transparent={true}
      onRequestClose={close}
    >
      <View style={styles.container}>
        <MFDefaultCard themeColors={themeColors}>
          <Text style={[styles.text, { color: themeColors.text }]}>
            {title}
          </Text>
          <MFTextInput
            labelIcon={iconLabel}
            icon={icon}
            themeColors={themeColors}
            placeholder={`Digite aqui...`}
            label={inputLabel}
            value={data}
            onChangeText={onChange}
            error={data ? "" : `Digite o ${inputLabel}`}
          ></MFTextInput>
          <View style={[styles.btnBox, { marginTop: 30 }]}>
            <MFModalSmallButton
              isDisabled={isLoading}
              type="1"
              title={!isLoading ? button1! : "Enviando"}
              themeColors={themeColors}
              onPress={
                !isLoading && data
                  ? onPress!
                  : () => {
                      Toast.show({
                        type: "error",
                        text1: `❌ Atenção, preencha ${inputLabel}.`,
                      });
                    }
              }
              isLoading={isLoading}
            />
            {!isLoading && (
              <MFModalSmallButton
                type="2"
                title={button2!}
                themeColors={themeColors}
                onPress={close!}
                isLoading={isLoading}
              />
            )}
          </View>
        </MFDefaultCard>
      </View>
    </Modal>
  );
}

export function MFCreateStepModal({
  isOPen,
  themeColors,
  title,
  inputLabel,
  button1,
  button2,
  onPress,
  close,
  isLoading,
  name,
  setName,
  description,
  setDescription,
}: MFCreateStepProps) {
  return (
    <Modal
      visible={isOPen}
      animationType="slide"
      transparent={true}
      onRequestClose={close}
    >
      <View style={styles.container}>
        <MFDefaultCard themeColors={themeColors}>
          <Text style={[styles.text, { color: themeColors.text }]}>
            {title}
          </Text>
          <MFTextInput
            themeColors={themeColors}
            placeholder={`Exemplo: Treino B, Treino de superiores...`}
            label={"Nome da divisão:"}
            value={name}
            onChangeText={setName}
            error={name ? "" : `Digite o nome da divisão`}
          ></MFTextInput>
          {/* <MFTextInput
            themeColors={themeColors}
            placeholder={`Digite aqui...`}
            label={"Descrição:"}
            value={description}
            onChangeText={setDescription}
          ></MFTextInput> */}
          <View style={[styles.btnBox, { marginTop: 30 }]}>
            <MFModalSmallButton
              isDisabled={isLoading}
              type="1"
              title={!isLoading ? button1! : "Enviando"}
              themeColors={themeColors}
              onPress={
                !isLoading && name
                  ? onPress!
                  : () => {
                      Toast.show({
                        type: "error",
                        text1: `❌ Atenção, preencha ${inputLabel}.`,
                      });
                    }
              }
              isLoading={isLoading}
            />
            {!isLoading && (
              <MFModalSmallButton
                type="2"
                title={button2!}
                themeColors={themeColors}
                onPress={close!}
                isLoading={isLoading}
              />
            )}
          </View>
        </MFDefaultCard>
      </View>
    </Modal>
  );
}

export default function MFYouTubeModal({
  video,
  ytModalVisible,
  setYtModalVisible,
}: {
  video: string;
  ytModalVisible: boolean;
  setYtModalVisible: (any: boolean) => void;
}) {
  return (
    <Modal
      animationType="slide"
      visible={ytModalVisible}
      onRequestClose={() => setYtModalVisible(false)}
    >
      <View style={{ flex: 1, backgroundColor: "black", padding: 20 }}>
        <View style={{ height: 130 }}></View>
        <WebView source={{ uri: video }} style={styles.ytVideoBox} />
        <TouchableOpacity
          onPress={() => setYtModalVisible(false)}
          style={styles.closeBtnYT}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Fechar</Text>
        </TouchableOpacity>
        <View style={{ height: 150 }}></View>
      </View>
    </Modal>
  );
}

export function MFDefaultModal({
  warningVisible,
  themeColors,
  text,
  onPress,
  close,
  isLoading,
  children,
  ...props
}: MFLoginProps) {
  return (
    <Modal visible={warningVisible} animationType="slide" transparent={true}>
      <Pressable style={styles.container} onPress={() => close()}>
        {children}
      </Pressable>
    </Modal>
  );
}
export function MFDefaultInfoModal({
  warningVisible,
  themeColors,
  text,
  onPress,
  close,
  isLoading,
  children,
  ...props
}: MFLoginProps) {
  return (
    <Modal visible={warningVisible} animationType="slide" transparent={true}>
      <Pressable style={styles.containerInfo} onPress={() => close()}>
        {children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerYT: { marginTop: 50, alignItems: "center" },
  openBtnYT: { color: "blue", fontSize: 18 },
  closeBtnYT: {
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 8,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 30,
  },
  containerInfo: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  text: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 30,
  },
  btnBox: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
  },
  button: {
    width: 80,
    height: 30,
  },
  ytVideoBox: {
    width: "100%",
    maxHeight: "90%",
  },
});
