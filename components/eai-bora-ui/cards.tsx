// prettier-ignore

import {
  formatDate,
  formatTimeAgo,
  getLevel,
  getRepetitionsFormat,
} from "@/controllers/utils";
import { globalStyles } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";

import React, { ReactNode, useEffect, useRef, useState } from "react";

import { Picker } from "@react-native-picker/picker";
import { MFDefaultCard } from "./baseCards";
import {
  MFAddFriendButton,
  MFModalSmallButton,
  MFSuccessButton,
} from "./buttons";
import { CommentSection } from "./comments";
import { MFLongTextInput, MFWheightInput } from "./inputs";
import MFYouTubeModal, { MFLogoutModal } from "./modal";
import MFSeparator from "./separator";

// Re-export base cards to maintain compatibility
export { MFDefaultCard, MFDefaultNoPadCard } from "./baseCards";

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
    padding: 0,
    margin: 0,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trainingBox: {
    width: "100%",
    minHeight: 100,
    height: 180,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  trainingBoxMirror: {
    width: "auto",
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingRight: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    zIndex: 1,
    gap: 10,
  },
  postBoxMirror: {
    width: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
    // paddingTop: 25,
    // paddingRight: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    zIndex: 1,
    gap: 10,
  },
  mirrorButton: {
    width: "100%",
    paddingVertical: 7,
    paddingHorizontal: 12,
    paddingRight: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 3,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  stepBox: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 0,
  },
  stepBoxOpen: {
    width: "100%",
    paddingVertical: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 0,
    gap: 20,
  },
  serieBox: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 0,
    borderWidth: 1,
    position: "relative",
    paddingHorizontal: 7,
    paddingVertical: 20,
    borderRadius: 5,
  },
  cardWarning: {
    position: "absolute",
    top: -10,
    left: 20,
    zIndex: 9,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  trainingLogo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    objectFit: "cover",
  },
  trainingBoxLastExecution: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  trainingBoxAvaliations: {
    position: "absolute",
    top: -15,
    right: 15,
    zIndex: 2,
  },
  trainingAvaliation: {
    paddingVertical: 2,
    paddingHorizontal: 13,
    borderRadius: 5,
    borderWidth: 1,
  },
  deleteExerciseBtn: {
    borderRadius: 200,
    padding: 5,
  },
  exerciseMain: {
    width: "100%",
    minHeight: 75,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 60,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 18,
  },
  exerciseMainOppened: {
    width: "100%",
    minHeight: 150,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  exerciseInfoBtn: {
    position: "absolute",
    left: 8,
    top: 10,
    borderWidth: 2,
    borderRadius: 100,
  },
  exerciseCheckBtn: {
    position: "absolute",
    right: 8,
    top: 10,
    borderRadius: 100,
  },
  boxInfoSampleExercises: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  boxInfoSampleExercisesOppened: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 20,
  },
  boxInfoSampleW: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseInfoFloat: {
    position: "absolute",
    top: -12,
    left: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  exerciseItemRepetition: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
  },
  containerClock: {
    position: "absolute",
    width: "90%",
    minHeight: 70,
    bottom: 10,
    left: "5%",
    zIndex: 9,
    paddingTop: 5,
    paddingBottom: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
  },
  clockBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonClock: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    width: 50,
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  InfoBoxModalShow: {
    width: "100%",
    zIndex: 9,
  },
  trainingInfoContainer: {
    width: "100%",
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  trainingInfoImageBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  trainingInfoPhoto: {
    width: 180,
    height: 100,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  evaluationTextInfo: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 900,
  },
  finishTrainingMain: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  finishTrainingtext: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 30,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  postCardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 0,
    marginTop: 10,
  },
  cardPost: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerPost: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarPost: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  avatarClientPost: {
    width: 55,
    height: 55,
    borderRadius: 55,
    marginRight: 10,
  },
  authorInfoPost: {
    flexDirection: "column",
  },
  authorNamePost: {
    fontSize: 16,
    fontWeight: "600",
  },
  datePost: {
    fontSize: 12,
  },
  bodyPost: {
    marginTop: 4,
    marginBottom: 10,
  },
  titlePost: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  descriptionPost: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  postImagePost: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  adminImagePost: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  cardPubli: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bodyPubli: {
    marginTop: 5,
    marginBottom: 15,
    paddingVertical: 10,
  },
  postImagePubli: {
    width: "100%",
  },
  createPostMain: {
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 1,
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createPostMainSelected: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 10,
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderBottomWidth: 1,
  },
  iconNewPostBox: {
    width: 38,
    height: 38,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  postContent: {
    width: "100%",
    gap: 15,
  },
  shopTrainingCard: {
    width: "45%",
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  shopTrainingImage: {
    width: "100%",
    height: 140,
  },
  shopTrainingInfo: {
    padding: 12,
  },
  shopTrainingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  shopTrainingDescription: {
    fontSize: 14,
  },
  shopTrainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopTrainingRating: {
    backgroundColor: "#FFD700",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  shopTrainingRatingText: {
    fontWeight: "600",
    color: "#333",
  },
  shopTrainingPriceContainer: {
    alignItems: "flex-end",
  },
  shopTrainingOldPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  shopTrainingPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  MFFreePrice: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: -5,
  },
  cardInfoPersonal: {
    elevation: 4,
    overflow: "hidden",
    paddingBottom: 20,
    marginBottom: 10,
  },
  backgroundImageInfoPersonal: {
    width: "100%",
    height: 150,
  },
  profileContainerInfoPersonal: {
    alignItems: "flex-start",
    padding: 16,
    marginTop: -100,
  },
  profileImageInfoPersonal: {
    width: 150,
    height: 150,
    borderRadius: 150,
    borderWidth: 3,
    marginBottom: 8,
  },
  nameInfoPersonal: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nickInfoPersonal: {
    fontSize: 14,
    marginBottom: 4,
  },
  descriptionInfoPersonal: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 4,
  },
  authorNamePostInfoPersonal: {
    fontSize: 24,
    fontWeight: "600",
  },
  adminImagePostInfoPersonal: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  wtsppBoxInfoPersonal: {
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  wtsppBtnInfoPersonal: {
    width: 200,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface MFDefaultCardProps extends ViewProps {
  themeColors?: any;
  children: ReactNode;
  withoutPadding?: boolean;
}

interface MFExerciseExecuteCardProps extends ViewProps {
  themeColors?: any;
  exerciseOpened: number | null;
  e?: any;
  a?: any;
  props?: any;
  setExerciseOpened: (value: number | null) => void;
  SeriesListChange: (
    exerciseId: number,
    difficultyIndex: number,
    value: string
  ) => void;
  FinishTrainingHandle: ({
    exerciseId,
    difficulty,
  }: {
    exerciseId: number;
    difficulty: string[];
  }) => Promise<boolean>;
  next?: number;
}

interface MFShopCardTrainingProps extends ViewProps {
  themeColors?: any;
  data?: any;
  onPress?: () => void;
}

export function MFTrainingExecutionCard({
  isNew,
  GoToExecution,
  isExecutionLoading,
  OpenModal,
  isInExecution,
  themeColors,
  data,
  Unassign,
  EditTraining,
  isHome,
  isMyTraining,
}: {
  isNew?: boolean;
  isExecutionLoading?: boolean;
  GoToExecution: (id: number) => void;
  OpenModal: (id: number, type: number) => void;
  isInExecution?: boolean;
  themeColors: any;
  data: any;
  Unassign: (id: number) => void;
  EditTraining?: (id: number) => void;
  isHome?: boolean;
  isMyTraining?: boolean;
}) {
  const [isOptionsOPen, setIsOptionsOPen] = useState<boolean>(false),
    [unassignOpen, setUnassignOpen] = useState<boolean>(false);

  function getStars({ avaliation }: { avaliation: number }) {
    const stars = [];

    for (let index = 0; index < 5; index++) {
      let name: "star" | "star-o" | "star-half-o";

      if (index + 1 <= avaliation) {
        name = "star";
      } else if (index < avaliation && avaliation < index + 1) {
        name = "star-half-o";
      } else {
        name = "star-o";
      }

      stars.push(
        <FontAwesome key={index} name={name} size={18} color="#FFD700" />
      );
    }

    return stars;
  }

  if (!data) {
    return <View></View>;
  }

  return (
    <Pressable
      onPress={
        isOptionsOPen === true
          ? () => setIsOptionsOPen(false)
          : isExecutionLoading
          ? null
          : !isInExecution
          ? () => data?.training?.id && OpenModal(data?.training?.id, 1)
          : isInExecution === data.id
          ? () => GoToExecution(data?.training?.trainingExecution[0].id)
          : null
      }
      onLongPress={
        isOptionsOPen === true
          ? () => setIsOptionsOPen(false)
          : !isInExecution
          ? () => setIsOptionsOPen(true)
          : isInExecution === data.id
          ? () => setIsOptionsOPen(true)
          : null
      }
      style={{ paddingTop: 20, marginBottom: 30 }}
    >
      <View
        key={data.id}
        style={[
          styles.trainingBox,
          {
            backgroundColor: themeColors.secondary,
            shadowColor: themeColors.text,
            position: "relative",
          },
        ]}
      >
        {unassignOpen && (
          <MFLogoutModal
            warningVisible={unassignOpen}
            themeColors={themeColors}
            text={"Deseja remover definitivamente o treino da sua lista?"}
            onPress={() => Unassign(data.id)}
            close={() => setUnassignOpen(false)}
            isLoading={isExecutionLoading}
          ></MFLogoutModal>
        )}
        {isOptionsOPen && !isHome && (
          <View
            key={data.id}
            style={[
              styles.trainingBoxMirror,
              {
                backgroundColor: themeColors.grey,
                borderWidth: 1,
                borderColor: themeColors.themeGrey,
                shadowColor: themeColors.text,
                position: "absolute",
                top: 3,
                right: 3,
              },
            ]}
          >
            {isInExecution !== data.id && EditTraining && (
              <TouchableOpacity
                onPress={() => {
                  EditTraining(data.id);
                  setIsOptionsOPen(false);
                }}
                style={[
                  styles.mirrorButton,
                  { backgroundColor: themeColors.white, position: "relative" },
                ]}
              >
                <Text>Editar treino</Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <FontAwesome name="edit" size={14} color="black" />
                </View>
              </TouchableOpacity>
            )}
            {isInExecution !== data.id && (
              <TouchableOpacity
                onPress={() => setUnassignOpen(true)}
                style={[
                  styles.mirrorButton,
                  { backgroundColor: themeColors.white, position: "relative" },
                ]}
              >
                <Text>Remover treino</Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <FontAwesome name="trash" size={14} color="black" />
                </View>
              </TouchableOpacity>
            )}
            {isInExecution === data.id && (
              <TouchableOpacity
                onPress={() =>
                  GoToExecution(data?.training?.trainingExecution[0].id)
                }
                style={[
                  styles.mirrorButton,
                  {
                    backgroundColor: themeColors.white,
                    position: "relative",
                  },
                ]}
              >
                <Text>Continuar Execução</Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="checksquare" size={12} color="black" />
                </View>
              </TouchableOpacity>
            )}
            {isInExecution === data.id && (
              <TouchableOpacity
                onPress={() =>
                  OpenModal(data?.training?.trainingExecution[0].id, 2)
                }
                style={[
                  styles.mirrorButton,
                  {
                    backgroundColor: themeColors.white,
                    position: "relative",
                  },
                ]}
              >
                <Text>Finalizar Execução</Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <FontAwesome name="window-close" size={12} color="black" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View
          style={[
            globalStyles.flexr,
            styles.trainingBoxAvaliations,
            { gap: 10 },
          ]}
        >
          {data.training?.evaluation && (
            <View
              style={[
                styles.trainingAvaliation,
                globalStyles.flexr,
                {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.grey,
                },
              ]}
            >
              {getStars({
                avaliation: data.training?.evaluation,
              })}
            </View>
          )}
          {isNew && (
            <View
              style={[
                styles.trainingAvaliation,
                {
                  backgroundColor: themeColors.info,
                  borderColor: themeColors.info,
                },
              ]}
            >
              <Text style={{ color: themeColors.white }}>NOVO</Text>
            </View>
          )}

          {data.training?.level && (
            <View
              style={[
                styles.trainingAvaliation,
                globalStyles.flexr,
                {
                  backgroundColor: getLevel({ level: +data.training?.level })
                    ?.BCcolor,
                  borderColor: themeColors.grey,
                },
              ]}
            >
              <Text
                style={{
                  color: getLevel({ level: +data.training?.level })?.FColor,
                }}
              >
                {getLevel({ level: +data.training?.level })?.name}
              </Text>
            </View>
          )}
          {isInExecution === data.id && (
            <View
              style={[
                styles.trainingAvaliation,
                globalStyles.flexr,
                {
                  backgroundColor: themeColors.orange,
                  borderColor: themeColors.danger,
                  gap: 7,
                },
              ]}
            >
              <FontAwesome5 name="clock" size={11} color={themeColors.danger} />
              <Text style={{ color: themeColors.danger }}>EM EXECUÇÃO</Text>
            </View>
          )}
          {isMyTraining && (
            <View
              style={[
                styles.trainingAvaliation,
                globalStyles.flexr,
                {
                  backgroundColor: themeColors.success,
                  borderColor: themeColors.success,
                  gap: 6,
                },
              ]}
            >
              <MaterialIcons
                name="verified"
                size={14}
                color={themeColors.white}
              />
              <Text
                style={{
                  color: themeColors.white,
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                CRIADO POR VOCÊ
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            globalStyles.flexr,
            {
              gap: 20,
              paddingBottom: 10,
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          ]}
        >
          {data?.training?.photo && data?.training?.photo.length > 1 ? (
            <Image
              style={[
                styles.trainingLogo,
                {
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.grey,
                  borderWidth: 1,
                },
              ]}
              source={{ uri: data.training.photo }}
            />
          ) : (
            <Image
              style={[
                styles.trainingLogo,
                {
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.grey,
                  borderWidth: 1,
                },
              ]}
              source={require("@/assets/images/eai-bora/icon-eab.png")}
            />
          )}
          <View
            style={[
              globalStyles.flexc,
              {
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                height: "100%",
                maxWidth: 200,
              },
            ]}
          >
            <Text
              style={{ fontWeight: 600, fontSize: 22, color: themeColors.text }}
            >
              {data?.training?.name?.length > 23
                ? `${data.training.name.slice(0, 20)}...`
                : data?.training?.name}
            </Text>
            <Text
              style={{ fontWeight: 400, fontSize: 15, color: themeColors.text }}
            >
              {data?.training?.description?.length > 78
                ? `${data.training.description.slice(0, 75)}...`
                : data?.training?.description}
            </Text>
            {data?.training?.user?.name && (
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 15,
                  color: themeColors.text,
                  marginTop: 10,
                }}
              >
                {`Autor: `}
                <Text style={{ fontWeight: 700 }}>
                  {data?.training?.user?.name}
                </Text>
              </Text>
            )}
          </View>
        </View>
        {data?.training?.trainingExecution &&
          data?.training?.trainingExecution.length > 0 && (
            <View
              style={[
                globalStyles.flexr,
                styles.trainingBoxLastExecution,
                { gap: 10 },
              ]}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 11,
                  color: themeColors.text,
                }}
              >
                Última execução:{" "}
                {formatDate(data?.training?.trainingExecution[0]?.startAt)}
              </Text>
            </View>
          )}
      </View>
    </Pressable>
  );
}

export function MFPlusCard({
  themeColors = { secondary: "#1a1a1a" },
  children,
  style,
  ...props
}: MFDefaultCardProps) {
  return (
    <View
      style={[styles.plus, { backgroundColor: themeColors.secondary }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function MFTrainingCard({
  isNew,
  themeColors,
  data,
}: {
  isNew?: boolean;
  themeColors: any;
  data: any;
}) {
  function getStars({ avaliation }: { avaliation: number }) {
    const stars = [];

    for (let index = 0; index < 5; index++) {
      stars.push(
        <AntDesign
          key={index}
          name={index < avaliation ? "star" : "staro"}
          size={18}
          color="#E1E111FF"
        />
      );
    }

    return stars;
  }

  if (!data) {
    return <View></View>;
  }

  return (
    <View
      key={data.id}
      style={[
        styles.trainingBox,
        {
          backgroundColor: themeColors.secondary,
          shadowColor: themeColors.text,
        },
      ]}
    >
      {data.training?.evaluation && (
        <View
          style={[
            styles.trainingAvaliation,
            globalStyles.flexr,
            {
              backgroundColor: themeColors.white,
              borderColor: themeColors.grey,
            },
          ]}
        >
          {getStars({ avaliation: data.training?.evaluation })}
        </View>
      )}
      <View
        style={[globalStyles.flexr, styles.trainingBoxAvaliations, { gap: 10 }]}
      >
        {isNew && (
          <View
            style={[
              styles.trainingAvaliation,
              {
                backgroundColor: themeColors.info,
                borderColor: themeColors.info,
              },
            ]}
          >
            <Text style={{ color: themeColors.white }}>NOVO</Text>
          </View>
        )}
      </View>
      <View style={[globalStyles.flexr, { gap: 20 }]}>
        <Image
          style={styles.trainingLogo}
          source={{ uri: data?.training?.photo }}
        />
        <View
          style={[
            globalStyles.flexc,
            {
              gap: 10,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              height: "100%",
              paddingVertical: 10,
            },
          ]}
        >
          <Text
            style={{ fontWeight: 600, fontSize: 22, color: themeColors.text }}
          >
            {data?.training?.name}
          </Text>
          <Text
            style={{ fontWeight: 400, fontSize: 15, color: themeColors.text }}
          >
            {data?.training?.description}
          </Text>
        </View>
      </View>
      {data?.training?.trainingExecution &&
        data?.training?.trainingExecution.length > 0 && (
          <View
            style={[
              globalStyles.flexr,
              styles.trainingBoxLastExecution,
              { gap: 10 },
            ]}
          >
            <Text
              style={{ fontWeight: 400, fontSize: 11, color: themeColors.text }}
            >
              Última execução:{" "}
              {formatDate(data?.training?.trainingExecution[0]?.startAt)}
            </Text>
          </View>
        )}
    </View>
  );
}

export function StepEditCard({
  themeColors,
  data,
  isIncomplete,
  token,
}: {
  themeColors: any;
  data: any;
  isIncomplete: boolean;
  token: string;
  onPress?: () => void;
}) {
  return (
    <View
      style={[
        globalStyles.flexc,
        { width: "100%", alignItems: "flex-start", position: "relative" },
      ]}
    >
      {isIncomplete && (
        <View
          style={[styles.cardWarning, { backgroundColor: themeColors.danger }]}
        >
          <Text style={{ color: "#ffffff", fontSize: 11 }}>Incompleto</Text>
        </View>
      )}
      <View
        style={[
          styles.stepBox,
          {
            backgroundColor: themeColors.secondary,
            shadowColor: themeColors.text,
          },
        ]}
      >
        <View
          style={[
            globalStyles.flexc,
            {
              width: "100%",
              height: "auto",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              globalStyles.flexr,
              {
                width: "100%",
                height: "auto",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <View style={[globalStyles.flexr, { gap: 10 }]}>
              <FontAwesome6
                name="dumbbell"
                size={12}
                color={themeColors.text}
              />
              <Text
                style={{
                  fontSize: 19,
                  color: themeColors.text,
                  fontWeight: 600,
                }}
              >
                {data?.name ? data?.name : "Sem nome"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
              }}
              style={[
                styles.deleteExerciseBtn,
                { backgroundColor: themeColors.danger },
              ]}
            >
              <AntDesign name="delete" size={17} color={themeColors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "50%",
          height: 1,
          backgroundColor: themeColors.themeGrey,
          marginTop: 30,
          marginLeft: 10,
        }}
      ></View>
    </View>
  );
}

export function MFExerciseExecuteClosedCard({
  themeColors,
  exerciseOpened,
  setExerciseOpened,
  e,
  a,
  props,
  SeriesListChange,
  FinishTrainingHandle,
  next,
}: MFExerciseExecuteCardProps) {
  const [isLoading, setIsLoading] = useState(false),
    [isAlreadyExecuted, setIsAlreadyExecuted] = useState(false),
    [executeModalVisible, setExecuteModalVisible] = useState(false);

  async function CompleteExercise() {
    setIsLoading(true);

    const res = await FinishTrainingHandle({
      exerciseId: e.id,
      difficulty: e.difficulty,
    });

    setIsLoading(false);
    setExecuteModalVisible(false);

    if (res === true) {
      setTimeout(() => {
        setExecuteModalVisible(false);
      }, 500);
    }
  }

  useEffect(() => {
    if (
      !!e.serieExecution &&
      Array.isArray(e.serieExecution) &&
      e.serieExecution?.length > 0
    ) {
      setIsAlreadyExecuted(true);
    } else {
      setIsAlreadyExecuted(false);
    }
  }, [e.serieExecution]);

  return (
    <View
      style={[
        styles.exerciseMain,
        {
          backgroundColor: !isAlreadyExecuted
            ? "transparent"
            : themeColors.successContrast,
        },
      ]}
    >
      <MFLogoutModal
        warningVisible={executeModalVisible}
        themeColors={themeColors}
        text={"Concluir este exercicio?"}
        onPress={CompleteExercise}
        close={() => setExecuteModalVisible(false)}
        isLoading={isLoading}
      ></MFLogoutModal>
      {!isAlreadyExecuted && (
        <TouchableOpacity
          onPress={() => setExerciseOpened(e.id)}
          style={[
            styles.exerciseInfoBtn,
            {
              backgroundColor: themeColors.black,
              borderColor: themeColors.grey,
            },
          ]}
        >
          <AntDesign name="downcircle" size={30} color={themeColors.grey} />
        </TouchableOpacity>
      )}
      <View style={styles.exerciseInfoFloat}>
        <View
          style={{
            backgroundColor: props.color,
            borderWidth: 1,
            borderColor: props.color,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: themeColors.white, fontWeight: 600 }}>
            {props?.name}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: props.color,
            borderWidth: 1,
            borderColor: props.color,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: themeColors.white, fontWeight: 600 }}>
            {e.difficulty?.length} x {getRepetitionsFormat(e.repetitions)}
          </Text>
        </View>
        {isAlreadyExecuted && (
          <View
            style={{
              backgroundColor: themeColors.success,
              borderWidth: 1,
              borderColor: themeColors.success,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: themeColors.white, fontWeight: 600 }}>
              Concluído
            </Text>
          </View>
        )}
        {next === e.id && (
          <View
            style={{
              backgroundColor: themeColors.orange,
              borderWidth: 1,
              borderColor: themeColors.orange,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: themeColors.white, fontWeight: 600 }}>
              Em execução
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: 15,
        }}
      >
        <Text
          style={{ color: themeColors.text, fontWeight: 600, fontSize: 22 }}
        >
          {e.exercise?.name}
        </Text>
      </View>
      <View style={styles.boxInfoSampleExercises}>
        <View style={styles.boxInfoSampleW}>
          {Array.isArray(e?.difficulty) &&
            e.difficulty.length > 0 &&
            e.difficulty.map((item: string, index: number) => (
              <MFWheightInput
                key={index}
                error={""}
                placeholder="0"
                value={item}
                onChangeText={(value) => SeriesListChange(a, index, value)}
                themeColors={themeColors}
              />
            ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={
          !isAlreadyExecuted
            ? () => {
                setExecuteModalVisible(true);
              }
            : () => null
        }
        style={[
          styles.exerciseCheckBtn,
          {
            backgroundColor: themeColors.grey,
          },
        ]}
      >
        <AntDesign
          name={!isAlreadyExecuted ? "checkcircleo" : "checkcircle"}
          size={35}
          color={
            !isAlreadyExecuted ? themeColors.themeGrey : themeColors.success
          }
        />
      </TouchableOpacity>
    </View>
  );
}

export function MFExerciseExecuteOppenedCard({
  themeColors,
  exerciseOpened,
  setExerciseOpened,
  e,
  a,
  props,
  SeriesListChange,
  FinishTrainingHandle,
  next,
}: MFExerciseExecuteCardProps) {
  const [ytModalVisible, setYtModalVisible] = useState(false),
    [executeModalVisible, setExecuteModalVisible] = useState(false);

  function CompleteExercise() {
    // Fecha o modal PRIMEIRO (instantâneo)
    setExecuteModalVisible(false);

    // Depois atualiza em background
    FinishTrainingHandle({
      exerciseId: e.id,
      difficulty: e.difficulty,
    });
  }

  return (
    <View style={styles.exerciseMainOppened}>
      <MFYouTubeModal
        video={e.exercise?.video}
        ytModalVisible={ytModalVisible}
        setYtModalVisible={setYtModalVisible}
      ></MFYouTubeModal>
      <MFLogoutModal
        warningVisible={executeModalVisible}
        themeColors={themeColors}
        text={"Concluir este exercicio?"}
        onPress={CompleteExercise}
        close={() => setExecuteModalVisible(false)}
        isLoading={false}
      ></MFLogoutModal>
      <TouchableOpacity
        onPress={() => setExerciseOpened(null)}
        style={[
          styles.exerciseInfoBtn,
          {
            backgroundColor: themeColors.black,
            borderColor: themeColors.grey,
            top: 20,
          },
        ]}
      >
        <AntDesign name="upcircle" size={30} color={themeColors.grey} />
      </TouchableOpacity>
      <View style={styles.exerciseInfoFloat}>
        <View
          style={{
            backgroundColor: props.color,
            borderWidth: 1,
            borderColor: props.color,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: themeColors.white, fontWeight: 600 }}>
            {props?.name}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: props.color,
            borderWidth: 1,
            borderColor: props.color,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: themeColors.white, fontWeight: 600 }}>
            {e.difficulty?.length} x {getRepetitionsFormat(e.repetitions)}
          </Text>
        </View>
        {next === e.id && (
          <View
            style={{
              backgroundColor: themeColors.orange,
              borderWidth: 1,
              borderColor: themeColors.orange,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: themeColors.white, fontWeight: 600 }}>
              Em execução
            </Text>
          </View>
        )}
      </View>
      <View style={styles.boxInfoSampleExercisesOppened}>
        <View style={styles.boxInfoSampleW}>
          <Text
            style={{
              color: themeColors.text,
              fontWeight: 600,
              fontSize: 26,
              paddingRight: 10,
            }}
          >
            {e.exercise?.name}
          </Text>
          {e.exercise?.video && (
            <TouchableOpacity onPress={() => setYtModalVisible(true)}>
              <Entypo name="video" size={24} color={themeColors.danger} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.boxInfoSampleW}>
          {Array.isArray(e?.difficulty) &&
            e.difficulty.length > 0 &&
            e.difficulty.map((item: string, index: number) => (
              <View key={index} style={styles.exerciseItemRepetition}>
                <FontAwesome5
                  name="dumbbell"
                  size={24}
                  color={themeColors.primary}
                />
                <Text
                  style={{
                    color: themeColors.text,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {index + 1}ª Série
                </Text>
                <Text
                  style={{
                    color: themeColors.text,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    color: themeColors.text,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {!!e.repetitions &&
                    Array.isArray(e.repetitions) &&
                    e.repetitions[index]}{" "}
                  repetições
                </Text>
                <Text
                  style={{
                    color: themeColors.text,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  -
                </Text>
                <MFWheightInput
                  error={""}
                  fontSize={20}
                  placeholder="0"
                  value={item}
                  onChangeText={(value) => SeriesListChange(a, index, value)}
                  themeColors={themeColors}
                />
              </View>
            ))}
        </View>
        <MFSuccessButton
          themeColors={themeColors}
          onPress={() => {
            setExecuteModalVisible(true);
          }}
          title="Completar Exercício"
        ></MFSuccessButton>
      </View>
    </View>
  );
}

export function MFClockExecute({
  themeColors,
  clockData,
}: {
  themeColors: any;
  clockData: any;
}) {
  const [centiseconds, setCentiseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const backgroundTimeRef = useRef<number>(0);

  // Gerencia o cronômetro
  useEffect(() => {
    if (isRunning) {
      // Inicia ou retoma o cronômetro
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setCentiseconds(Math.floor(elapsed / 10));
      }, 50); // 50ms para mais precisão

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning]);

  // Gerencia quando o app minimiza/maximiza
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (isRunning) {
        if (nextAppState === "background" || nextAppState === "inactive") {
          // App minimizado - salva o tempo atual
          backgroundTimeRef.current = Date.now();
        } else if (nextAppState === "active" && backgroundTimeRef.current > 0) {
          // App retornou - ajusta o tempo
          const timeInBackground = Date.now() - backgroundTimeRef.current;
          startTimeRef.current -= timeInBackground;
          backgroundTimeRef.current = 0;
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [isRunning]);

  // Verifica se passou do tempo sugerido
  useEffect(() => {
    if (clockData?.interval && centiseconds > 0) {
      setIsTimeOut(centiseconds / 100 > clockData.interval);
    } else {
      setIsTimeOut(false);
    }
  }, [centiseconds, clockData?.interval]);

  const formatTime = (cs: number) => {
    const totalSeconds = Math.floor(cs / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centis = cs % 100;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isRunning) {
      // Pausar
      setIsRunning(false);
    } else {
      // Iniciar/Retomar
      if (centiseconds === 0) {
        startTimeRef.current = Date.now();
      }
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setCentiseconds(0);
    setIsTimeOut(false);
    startTimeRef.current = 0;
    setIsRunning(false);
  };

  const getPlayPauseColor = () => {
    if (isRunning) return themeColors.warning;
    return themeColors.success;
  };

  const progressPercentage = clockData?.interval
    ? Math.min((centiseconds / 100 / clockData.interval) * 100, 100)
    : 0;

  return (
    <View
      style={[
        styles.containerClock,
        {
          backgroundColor: themeColors.secondary,
          borderColor: isTimeOut ? themeColors.danger : themeColors.text,
          shadowColor: themeColors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        },
      ]}
    >
      {/* Informação do exercício */}
      {clockData?.exercise?.name && clockData?.interval && (
        <View style={{ width: "100%", marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 13,
              color: themeColors.text,
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {clockData.exercise.name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: themeColors.textSecondary,
              textAlign: "left",
              marginTop: 2,
            }}
          >
            Descanso sugerido: {clockData.interval}s
          </Text>
        </View>
      )}

      {/* Timer display */}
      <View style={styles.clockBox}>
        <Text
          style={{
            fontFamily: "Orbitron",
            fontSize: 48,
            fontWeight: "bold",
            color: isTimeOut ? themeColors.danger : themeColors.text,
            letterSpacing: 2,
          }}
        >
          {formatTime(centiseconds)}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {/* Botão Reset - só aparece se tempo > 0 */}
          {centiseconds > 0 && (
            <TouchableOpacity
              style={[
                styles.buttonClock,
                {
                  backgroundColor: themeColors.info,
                  borderColor: themeColors.info,
                  borderWidth: 0,
                  shadowColor: themeColors.info,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 4,
                },
              ]}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <FontAwesome name="refresh" size={22} color={themeColors.white} />
            </TouchableOpacity>
          )}

          {/* Botão Play/Pause */}
          <TouchableOpacity
            style={[
              styles.buttonClock,
              {
                backgroundColor: getPlayPauseColor(),
                borderColor: getPlayPauseColor(),
                borderWidth: 0,
                shadowColor: getPlayPauseColor(),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            {isRunning ? (
              <Ionicons name="pause" size={24} color={themeColors.white} />
            ) : (
              <Ionicons name="play" size={24} color={themeColors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de progresso */}
      {clockData?.interval && (
        <View
          style={{
            width: "100%",
            height: 8,
            backgroundColor: themeColors.default + "40",
            borderRadius: 10,
            marginTop: 12,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progressPercentage}%`,
              backgroundColor: isTimeOut
                ? themeColors.danger
                : themeColors.success,
              borderRadius: 10,
            }}
          />
        </View>
      )}

      {/* Indicador de tempo excedido */}
      {isTimeOut && (
        <View style={{ marginTop: 8, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              color: themeColors.danger,
              fontWeight: "600",
            }}
          >
            ⚠️ Tempo de descanso excedido
          </Text>
        </View>
      )}
    </View>
  );
}

export function MFTrainingInfoCard({
  themeColors,
  data,
  NewEvaluationTrainingHandle,
  close,
  muscleGroups,
  isLoading,
}: {
  themeColors: any;
  data?: any;
  NewEvaluationTrainingHandle: ({
    newEvaluation,
    newObservation,
  }: {
    newEvaluation: number;
    newObservation: string;
  }) => void;
  close?: () => void;
  muscleGroups?: any;
  isLoading?: boolean;
}) {
  const windowHeight = Dimensions.get("window").height,
    [step, setStep] = useState<number>(1),
    [newEvaluation, setNewEvaluation] = useState<number>(
      data?.myEvaluation?.evaluation
    ),
    [newObservation, setnewObservation] = useState<string>(
      data?.myEvaluation?.observation
    );

  function GetGroupProps(id: number) {
    const x = muscleGroups.find((a: any) => a.id === id);

    return x;
  }

  const renderStars = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setNewEvaluation(num)}>
            <FontAwesome
              name={!!newEvaluation && newEvaluation >= num ? "star" : "star-o"}
              size={36}
              color="#FFD700"
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.InfoBoxModalShow}>
      <TouchableWithoutFeedback>
        <MFDefaultCard themeColors={themeColors}>
          <View
            style={[
              styles.trainingInfoContainer,
              {
                position: "relative",
                maxHeight: windowHeight * 0.8,
                width: "100%",
              },
            ]}
          >
            <TouchableOpacity
              onPress={close}
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                backgroundColor: themeColors.text,
                borderRadius: 100,
                padding: 2,
              }}
            >
              <AntDesign
                name="closecircle"
                size={45}
                color={themeColors.white}
              />
            </TouchableOpacity>
            {step === 1 ? (
              <ScrollView>
                <View style={styles.trainingInfoImageBox}>
                  <Image
                    source={{ uri: data?.photo }}
                    style={[
                      styles.trainingInfoPhoto,
                      {
                        backgroundColor: themeColors.primaryContrast,
                        borderWidth: 3,
                        borderColor: themeColors.text,
                      },
                    ]}
                  />
                </View>
                {data.evaluation && (
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      paddingVertical: 10,
                      color: themeColors.text,
                    }}
                  >
                    {data?.name}{" "}
                    <Text
                      style={[
                        styles.evaluationTextInfo,
                        {
                          color:
                            data.evaluation >= 4
                              ? themeColors.success
                              : data.evaluation < 4 && data.evaluation >= 3
                              ? themeColors.orange
                              : themeColors.danger,
                        },
                      ]}
                    >
                      {`(${data.evaluation.toFixed(1).replaceAll(".", ", ")}`}{" "}
                      <AntDesign
                        name="star"
                        size={15}
                        color={themeColors.orange}
                      />
                      {`)`}
                    </Text>
                  </Text>
                )}
                {data?.author?.name && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: themeColors.text,
                        marginRight: 4,
                      }}
                    >
                      Autor:
                    </Text>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "900",
                        color: themeColors.text,
                        marginRight: 8,
                      }}
                    >
                      {data.author.name}
                    </Text>

                    {data?.author?.cref && (
                      <View
                        style={[
                          globalStyles.flexr,
                          {
                            backgroundColor: themeColors.white,
                            borderColor: themeColors.grey,
                            borderWidth: 1,
                            alignItems: "center",
                            paddingHorizontal: 7,
                            borderRadius: 5,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "900",
                            color: "#105661",
                          }}
                        >
                          Cr
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "900",
                            color: "#3F9933",
                          }}
                        >
                          ef
                        </Text>
                        <FontAwesome
                          style={{ marginLeft: 5 }}
                          name="check-circle"
                          size={14}
                          color={themeColors.success}
                        />
                      </View>
                    )}
                  </View>
                )}

                {data?.exercises && Array.isArray(data?.exercises) && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Exercícios:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {data?.exercises?.length}
                    </Text>
                  </Text>
                )}
                {data?.level && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: themeColors.text,
                        marginRight: 5,
                      }}
                    >
                      Dificuldade:
                    </Text>

                    <View
                      style={{
                        paddingHorizontal: 7,
                        borderRadius: 4,
                        backgroundColor: getLevel({ level: +data?.level })
                          ?.BCcolor,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "900",
                          color: getLevel({ level: +data?.level })?.FColor,
                        }}
                      >
                        {getLevel({ level: +data?.level })?.name}
                      </Text>
                    </View>
                  </View>
                )}

                {data?.exercises && Array.isArray(data.exercises) && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: themeColors.text,
                        marginRight: 5,
                      }}
                    >
                      Grupo{data.exercises.length > 1 ? "s" : ""}:
                    </Text>

                    {[
                      ...new Set(
                        data.exercises.map((e: any) => e.groupMuscleId)
                      ),
                    ].map((id: any, y: number) => {
                      const props = GetGroupProps(id);
                      return (
                        <View
                          key={y}
                          style={{
                            marginRight: 6,
                            paddingHorizontal: 7,
                            borderRadius: 4,
                            backgroundColor: props.color,
                          }}
                        >
                          <Text style={{ fontWeight: "900", color: "#fff" }}>
                            {props.name}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {data?.CompanyResposibleId && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Empresa:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {data?.CompanyResposibleId}
                    </Text>
                  </Text>
                )}
                {data?.createdAt && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Criado em:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {formatDate(data?.createdAt)}
                    </Text>
                  </Text>
                )}
                {data?.description && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    <AntDesign
                      name="infocirlce"
                      size={14}
                      color={themeColors.text}
                    />
                    {"  "}
                    {data?.description}
                  </Text>
                )}
                <View
                  style={{
                    width: "100%",
                    paddingVertical: 25,
                    paddingHorizontal: 15,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <MFSeparator
                    width={220}
                    height={1}
                    color={themeColors.text}
                  ></MFSeparator>
                </View>
                {data?.assignmentDate && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Seu desde:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {formatDate(data?.assignmentDate)}
                    </Text>
                  </Text>
                )}
                {data?.executionsCount && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color:
                        !!data?.maxExecutions &&
                        data?.executionsCount >= data?.maxExecutions
                          ? themeColors.danger
                          : themeColors.text,
                    }}
                  >
                    Suas execuções:{" "}
                    {!!data?.maxExecutions &&
                      data?.executionsCount >= data?.maxExecutions && (
                        <>
                          <AntDesign
                            name="infocirlce"
                            size={14}
                            color={themeColors.danger}
                          />{" "}
                        </>
                      )}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {data?.executionsCount}
                      {data?.maxExecutions ? " de " : ""}
                      {data?.maxExecutions ? data?.maxExecutions : ""}
                    </Text>
                  </Text>
                )}
                {data?.TotalExecutionsCount && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Total execuções:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      {data?.TotalExecutionsCount}
                    </Text>
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color:
                      !!data?.expirationDate &&
                      new Date() >= new Date(data?.expirationDate)
                        ? themeColors.danger
                        : themeColors.text,
                  }}
                >
                  Expira em:{" "}
                  {!!data?.expirationDate &&
                    new Date() >= new Date(data?.expirationDate) && (
                      <>
                        <AntDesign
                          name="infocirlce"
                          size={14}
                          color={themeColors.danger}
                        />{" "}
                      </>
                    )}
                  <Text
                    style={{
                      fontWeight: 900,
                    }}
                  >
                    {data?.expirationDate
                      ? formatDate(data?.expirationDate)
                      : "- não expira"}
                  </Text>
                </Text>
                {data?.myEvaluation?.evaluation && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: themeColors.text,
                    }}
                  >
                    Sua avaliação:{" "}
                    <Text
                      style={{
                        fontWeight: 900,
                      }}
                    >
                      <Text
                        style={[
                          styles.evaluationTextInfo,
                          {
                            color:
                              data.myEvaluation?.evaluation >= 4
                                ? themeColors.success
                                : data.myEvaluation?.evaluation < 4 &&
                                  data.myEvaluation?.evaluation >= 3
                                ? themeColors.orange
                                : themeColors.danger,
                          },
                        ]}
                      >
                        {`${data.myEvaluation?.evaluation
                          .toFixed(1)
                          .replaceAll(".", ", ")}`}{" "}
                        <AntDesign
                          name="star"
                          size={15}
                          color={themeColors.orange}
                        />
                      </Text>
                    </Text>
                  </Text>
                )}
                <View
                  style={{
                    width: "100%",
                    paddingTop: 40,
                    paddingHorizontal: 40,
                  }}
                >
                  <MFSuccessButton
                    themeColors={themeColors}
                    onPress={() => setStep(2)}
                    title={
                      data?.myEvaluation?.evaluation
                        ? "Reavaliar treino"
                        : "Avaliar treino"
                    }
                  ></MFSuccessButton>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.finishTrainingMain}>
                <Text
                  style={[
                    styles.finishTrainingtext,
                    { color: themeColors.text, marginBottom: 16 },
                  ]}
                >
                  Por favor, avalie o treino:
                </Text>
                {renderStars()}
                <MFLongTextInput
                  themeColors={themeColors}
                  placeholder="Comente..."
                  value={newObservation}
                  onChangeText={setnewObservation}
                />
                <View style={globalStyles.flexr}>
                  {isLoading && (
                    <MFModalSmallButton
                      type="4"
                      title=""
                      disabled={true}
                      themeColors={themeColors}
                      onPress={() => {}}
                      isLoading={isLoading}
                    />
                  )}
                  {!isLoading && (
                    <>
                      <MFModalSmallButton
                        type="4"
                        title="CANCELAR"
                        disabled={isLoading}
                        themeColors={themeColors}
                        onPress={() => setStep(1)}
                        isLoading={isLoading}
                      />
                      <MFModalSmallButton
                        type="1"
                        title="Concluir"
                        disabled={isLoading}
                        themeColors={themeColors}
                        onPress={() =>
                          NewEvaluationTrainingHandle({
                            newEvaluation,
                            newObservation,
                          })
                        }
                        isLoading={isLoading}
                      />
                    </>
                  )}
                </View>
              </View>
            )}
          </View>
        </MFDefaultCard>
      </TouchableWithoutFeedback>
    </View>
  );
}

export function MFPostCard({
  themeColors,
  data,
  friendStatus,
  onPress,
  token,
  userId,
}: {
  themeColors: any;
  data: any;
  friendStatus: number;
  onPress: () => void;
  token?: string;
  userId?: number;
}) {
  const { title, description, image, createdAt, updatedAt, client, company } =
    data;

  // Determine if it's a company post or client post
  const isCompanyPost = !client && company;
  const authorPhoto = isCompanyPost ? company?.photo : client?.photo;
  const authorName = isCompanyPost
    ? company?.name
    : client?.nick
    ? client.nick
    : client?.name;

  return (
    <View style={[styles.cardPost, { backgroundColor: themeColors.secondary }]}>
      <View style={[styles.headerPost, { position: "relative" }]}>
        <MFAddFriendButton
          title=""
          themeColors={themeColors}
          type={friendStatus}
          onPress={onPress}
        ></MFAddFriendButton>
        {authorPhoto ? (
          <Image source={{ uri: authorPhoto }} style={styles.avatarPost} />
        ) : (
          <View
            style={[
              styles.avatarPost,
              {
                backgroundColor: themeColors.background,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons
              name={isCompanyPost ? "business" : "person"}
              size={24}
              color={themeColors.primary}
            />
          </View>
        )}
        <View style={styles.authorInfoPost}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 2,
            }}
          >
            <Text style={[styles.authorNamePost, { color: themeColors.text }]}>
              {authorName || "Usuário"}
            </Text>
            {client?.userType && client?.userType === 1 && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  source={require("@/assets/images/eai-bora/icon-eab.png")}
                  style={[
                    styles.adminImagePost,
                    { borderColor: themeColors.grey, padding: 2 },
                  ]}
                  resizeMode="cover"
                />
              </View>
            )}
            {client?.userType &&
              (client?.userType === 3 || client?.userType === 4) && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="workspace-premium"
                    size={18}
                    color={
                      client?.userType === 3
                        ? themeColors.orange
                        : client?.userType === 4
                        ? themeColors.primary
                        : "black"
                    }
                  />
                </View>
              )}
            {client?.cref && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#105661",
                  }}
                >
                  Cr
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#3F9933",
                  }}
                >
                  ef
                </Text>
                <FontAwesome
                  style={{ marginLeft: 5 }}
                  name="check-circle"
                  size={14}
                  color={themeColors.success}
                />
              </View>
            )}
          </View>
          {!!createdAt || !!updatedAt ? (
            <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
              {updatedAt
                ? `editado ${formatTimeAgo(updatedAt)}`
                : formatTimeAgo(createdAt)}
              {"  "}
              <FontAwesome5
                name="clock"
                size={12}
                color={themeColors.themeGrey}
              />
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bodyPost}>
        {title && (
          <Text style={[styles.titlePost, { color: themeColors.text }]}>
            {title}
          </Text>
        )}
        {description && (
          <Text style={[styles.descriptionPost, , { color: themeColors.text }]}>
            {description}
          </Text>
        )}
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.postImagePost}
            resizeMode="cover"
          />
        )}
      </View>

      {token && userId && (
        <CommentSection
          postId={data.id}
          token={token}
          themeColors={themeColors}
          userId={userId}
          initialCommentsCount={data._count?.comments || 0}
        />
      )}
    </View>
  );
}

export function MFAdmimPostCard({
  themeColors,
  data,
  token,
  userId,
}: {
  themeColors: any;
  data: any;
  token?: string;
  userId?: number;
}) {
  const { title, description, image, createdAt, updatedAt, client, company } =
    data;

  // Determine if it's a company post or client post
  const isCompanyPost = !client && company;
  const authorPhoto = isCompanyPost ? company?.photo : client?.photo;
  const authorName = isCompanyPost
    ? company?.name
    : client?.nick
    ? client.nick
    : client?.name;

  return (
    <View
      style={[
        styles.cardPost,
        {
          backgroundColor: themeColors.secondary,
          borderTopWidth: 1,
          borderTopColor: themeColors.primaryOpacity,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.primaryOpacity,
          borderStyle: "dashed",
        },
      ]}
    >
      <View style={styles.headerPost}>
        {authorPhoto ? (
          <Image
            source={{ uri: authorPhoto }}
            style={[
              styles.avatarPost,
              { borderWidth: 3, borderColor: themeColors.primary },
            ]}
          />
        ) : (
          <View
            style={[
              styles.avatarPost,
              {
                backgroundColor: themeColors.background,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: themeColors.primary,
              },
            ]}
          >
            <Ionicons
              name={isCompanyPost ? "business" : "person"}
              size={24}
              color={themeColors.primary}
            />
          </View>
        )}
        <View style={styles.authorInfoPost}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 2,
            }}
          >
            <Text
              style={[
                styles.authorNamePost,
                { color: themeColors.primary, fontWeight: 900 },
              ]}
            >
              {authorName || "Usuário"}
            </Text>
            {client?.userType && client?.userType === 1 && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  source={require("@/assets/images/eai-bora/icon-eab.png")}
                  style={[
                    styles.adminImagePost,
                    { borderColor: themeColors.grey, padding: 2 },
                  ]}
                  resizeMode="cover"
                />
              </View>
            )}
            {client?.userType &&
              (client?.userType === 3 || client?.userType === 4) && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="workspace-premium"
                    size={18}
                    color={
                      client?.userType === 3
                        ? themeColors.orange
                        : client?.userType === 4
                        ? themeColors.primary
                        : "black"
                    }
                  />
                </View>
              )}
            {client?.cref && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#105661",
                  }}
                >
                  Cr
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#3F9933",
                  }}
                >
                  ef
                </Text>
                <FontAwesome
                  style={{ marginLeft: 5 }}
                  name="check-circle"
                  size={14}
                  color={themeColors.success}
                />
              </View>
            )}
          </View>
          {!!createdAt || !!updatedAt ? (
            <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
              {updatedAt
                ? `editado ${formatTimeAgo(updatedAt)}`
                : formatTimeAgo(createdAt)}
              {"  "}
              <FontAwesome5
                name="clock"
                size={12}
                color={themeColors.themeGrey}
              />
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bodyPost}>
        {title && (
          <Text style={[styles.titlePost, { color: themeColors.text }]}>
            {title}
          </Text>
        )}
        {description && (
          <Text style={[styles.descriptionPost, , { color: themeColors.text }]}>
            {description}
          </Text>
        )}
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.postImagePost}
            resizeMode="cover"
          />
        )}
      </View>

      {token && userId && (
        <CommentSection
          postId={data.id}
          token={token}
          themeColors={themeColors}
          userId={userId}
          initialCommentsCount={data._count?.comments || 0}
        />
      )}
    </View>
  );
}

export function MFMyPostCard({
  themeColors,
  data,
  user,
  isLoading,
  isPostLoading,
  deleteThisPost,
  unassignOpen,
  setUnassignOpen,
  goToEditPost,
  token,
  userId,
}: {
  themeColors: any;
  data: any;
  user: any;
  isLoading?: boolean;
  isPostLoading?: boolean;
  deleteThisPost: (value: number) => void;
  unassignOpen: boolean;
  setUnassignOpen: (value: boolean) => void;
  goToEditPost: (data: any) => void;
  token?: string;
  userId?: number;
}) {
  const { title, description, image, createdAt, updatedAt } = data;
  const { client } = user,
    [isOptionsOPen, setIsOptionsOPen] = useState<boolean>(false);

  return (
    <Pressable
      onPress={isOptionsOPen === true ? () => setIsOptionsOPen(false) : null}
    >
      <View
        style={[
          styles.cardPost,
          {
            backgroundColor: themeColors.backgroundSecondary,
            borderWidth: 1,
            borderColor: themeColors.backgroundSecondary,
            position: "relative",
          },
        ]}
      >
        <Pressable
          onPress={() => setIsOptionsOPen(!isOptionsOPen)}
          style={{ position: "absolute", top: 10, right: 10, padding: 5 }}
        >
          <SimpleLineIcons
            name="options-vertical"
            size={20}
            color={themeColors.text}
          />
        </Pressable>
        {isOptionsOPen && (
          <View
            key={data.id}
            style={[
              styles.postBoxMirror,
              {
                backgroundColor: themeColors.background,
                borderWidth: 1,
                borderColor: themeColors.themeGrey,
                shadowColor: themeColors.text,
                position: "absolute",
                top: 3,
                right: 3,
              },
            ]}
          >
            {unassignOpen && (
              <MFLogoutModal
                warningVisible={unassignOpen}
                themeColors={themeColors}
                text={"Deseja deletar definitivamente o post?"}
                onPress={() => deleteThisPost(data?.id)}
                close={() => setUnassignOpen(false)}
                isLoading={isLoading || isPostLoading}
              ></MFLogoutModal>
            )}
            <TouchableOpacity
              onPress={() => goToEditPost(data)}
              style={[
                styles.mirrorButton,
                { backgroundColor: themeColors.white, position: "relative" },
              ]}
            >
              <Text style={{ color: themeColors.text }}>Editar</Text>
              <View style={{ position: "absolute", right: 10 }}>
                <Feather name="edit" size={12} color={themeColors.text} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnassignOpen(true)}
              style={[
                styles.mirrorButton,
                { backgroundColor: themeColors.white, position: "relative" },
              ]}
            >
              <Text style={{ color: themeColors.text }}>Deletar</Text>
              <View style={{ position: "absolute", right: 10 }}>
                <FontAwesome name="trash" size={14} color={themeColors.text} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.headerPost}>
          {client?.photo ? (
            <Image
              source={{ uri: client?.photo }}
              style={[
                styles.avatarPost,
                { borderColor: themeColors.success, borderWidth: 3 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatarPost,
                {
                  backgroundColor: themeColors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: themeColors.success,
                  borderWidth: 3,
                },
              ]}
            >
              <Ionicons name="person" size={24} color={themeColors.primary} />
            </View>
          )}
          <View style={styles.authorInfoPost}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 2,
              }}
            >
              <Text
                style={[
                  styles.authorNamePost,
                  { color: themeColors.success, fontWeight: 900 },
                ]}
              >
                Você
              </Text>
              {client?.userType && client?.userType === 1 && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/eai-bora/icon-eab.png")}
                    style={[
                      styles.adminImagePost,
                      { borderColor: themeColors.grey, padding: 2 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              )}
              {client?.userType &&
                (client?.userType === 3 || client?.userType === 4) && (
                  <View
                    style={[
                      globalStyles.flexr,
                      {
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="workspace-premium"
                      size={18}
                      color={
                        client?.userType === 3
                          ? themeColors.orange
                          : client?.userType === 4
                          ? themeColors.primary
                          : "black"
                      }
                    />
                  </View>
                )}
              {client?.cref && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: themeColors.grey,
                      borderWidth: 1,
                      alignItems: "center",
                      paddingHorizontal: 7,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#105661",
                    }}
                  >
                    Cr
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#3F9933",
                    }}
                  >
                    ef
                  </Text>
                  <FontAwesome
                    style={{ marginLeft: 5 }}
                    name="check-circle"
                    size={14}
                    color={themeColors.success}
                  />
                </View>
              )}
            </View>
            {!!createdAt || !!updatedAt ? (
              <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
                {updatedAt
                  ? `editado ${formatTimeAgo(updatedAt)}`
                  : formatTimeAgo(createdAt)}
                {"  "}
                <FontAwesome5
                  name="clock"
                  size={12}
                  color={themeColors.themeGrey}
                />
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.bodyPost}>
          {title && (
            <Text style={[styles.titlePost, { color: themeColors.text }]}>
              {title}
            </Text>
          )}
          {description && (
            <Text
              style={[styles.descriptionPost, , { color: themeColors.text }]}
            >
              {description}
            </Text>
          )}
          {image && (
            <Image
              source={{ uri: image }}
              style={styles.postImagePost}
              resizeMode="cover"
            />
          )}
        </View>

        {token && userId && (
          <CommentSection
            postId={data.id}
            token={token}
            themeColors={themeColors}
            userId={userId}
            initialCommentsCount={data._count?.comments || 0}
          />
        )}
      </View>
    </Pressable>
  );
}

export function MFPubliCard({
  themeColors,
  data,
}: {
  themeColors: any;
  data: any;
}) {
  const { image, url } = data;
  const simageWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").width * 0.8;
  return (
    <View style={styles.cardPubli}>
      <Pressable onPress={() => Linking.openURL(url)}>
        <View
          style={[
            styles.bodyPubli,
            { backgroundColor: themeColors.backgroundSecondary },
          ]}
        >
          {image && (
            <Image
              source={image}
              style={[
                styles.postImagePubli,
                { height: screenHeight, width: simageWidth },
              ]}
              resizeMode="cover"
            />
          )}
          <View
            style={[
              globalStyles.flexr,
              {
                justifyContent: "space-between",
                paddingTop: 10,
                paddingHorizontal: 15,
              },
            ]}
          >
            <View>
              <Text style={{ fontSize: 13, color: themeColors.themeGrey }}>
                Publicidade.
              </Text>
              <Text style={{ fontSize: 10, color: themeColors.themeGrey }}>
                As informações são de responsabilidade do anunciante. *
              </Text>
            </View>

            <View
              style={[
                globalStyles.flexr,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  marginRight: 10,
                  borderRadius: 5,
                  backgroundColor: themeColors.grey,
                },
              ]}
            >
              <Text style={{ fontSize: 14, color: themeColors.black }}>
                Ver mais
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export function MFCreatePostCard({
  themeColors,
  HandleSendPost,
  HandleEditPost,
  isLoading,
  title,
  setTitle,
  description,
  setDescription,
  pickImage,
  openCamera,
  image,
  postStatus,
  setPostStatus,
  isPostOpen,
  setIsPostOpen,
  noImage,
  imageUrl,
  postId,
  setPostId,
}: {
  themeColors: any;
  isLoading: boolean;
  HandleSendPost: () => void;
  HandleEditPost: () => void;
  title: string | null;
  setTitle: (value: string | null) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  pickImage: () => void;
  openCamera: () => void;
  image: any;
  postStatus: string;
  setPostStatus: (value: string) => void;
  isPostOpen: boolean;
  setIsPostOpen: (value: boolean) => void;
  noImage: () => void;
  imageUrl?: string | null;
  postId?: number | null;
  setPostId: (value: number | null) => void;
}) {
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const postTypes = [
    { value: "1", label: "Público" },
    { value: "2", label: "Privado" },
  ];

  useEffect(() => {
    if (isPostOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPostOpen, slideAnim, fadeAnim]);

  return (
    <Pressable
      onPress={
        !isPostOpen ? () => setIsPostOpen(true) : () => Keyboard.dismiss()
      }
      style={{ width: "100%" }}
    >
      <View
        style={
          isPostOpen
            ? [
                globalStyles.flexc,
                styles.createPostMainSelected,
                {
                  backgroundColor: themeColors.secondary,
                  borderColor: themeColors.secondary,
                  marginTop: 20,
                },
              ]
            : [globalStyles.flexc, styles.createPostMain]
        }
      >
        {isPostOpen ? (
          <View
            style={[
              globalStyles.flexr,
              {
                width: "100%",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              },
            ]}
          >
            <View style={[globalStyles.flexr, { gap: 5 }]}>
              <Pressable
                onPress={
                  postId
                    ? () => {
                        noImage();
                        setTitle(null);
                        setPostId(null);
                        setDescription(null);
                        setIsPostOpen(false);
                      }
                    : () => setIsPostOpen(false)
                }
              >
                <AntDesign name="close" size={26} color={themeColors.text} />
              </Pressable>
              <Text
                style={{
                  fontSize: 24,
                  color: themeColors.text,
                  fontWeight: 700,
                }}
              >
                {postId ? "  Editar post" : "  Novo post"}
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                height: 35,
                backgroundColor: themeColors.background,
                borderColor: themeColors.text,
                opacity: 1,
                borderWidth: 1,
                padding: 0,
                margin: 0,
                borderRadius: 7,
              }}
            >
              <Picker
                enabled={true}
                selectedValue={postStatus ? postStatus : "1"}
                onValueChange={setPostStatus}
                style={{
                  width: "100%",
                  padding: 0,
                  margin: 0,
                  borderWidth: 1,
                  marginTop: -10,
                  color: themeColors.text,
                  backgroundColor: "#FFFFFF00",
                }}
                dropdownIconColor={themeColors.text}
                itemStyle={{
                  fontSize: 8,
                }}
              >
                {postTypes.map((opt) => (
                  <Picker.Item
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ) : (
          <View></View>
        )}
        <Pressable
          onPress={!isPostOpen ? () => setIsPostOpen(true) : null}
          style={[styles.postContent, globalStyles.flexr]}
        >
          <TextInput
            id="post-text"
            style={{
              borderWidth: 1,
              borderColor: themeColors.text,
              borderRadius: 8,
              paddingHorizontal: 10,
              justifyContent: "center",
              width: "70%",
            }}
            onFocus={() => {
              if (!isPostOpen) {
                setIsPostOpen(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 500);
              }
            }}
            placeholder="No que você está pensando..."
            keyboardType="default"
            value={title!}
            onChangeText={setTitle}
            placeholderTextColor={themeColors.textSecondary}
          />

          <TouchableOpacity
            onPress={pickImage}
            style={[styles.iconNewPostBox, { borderColor: themeColors.text }]}
          >
            <MaterialIcons
              name="attach-file"
              size={20}
              color={themeColors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openCamera}
            style={[styles.iconNewPostBox, { borderColor: themeColors.text }]}
          >
            <FontAwesome name="camera" size={19} color={themeColors.text} />
          </TouchableOpacity>
        </Pressable>
        {isPostOpen ? (
          <Animated.View
            key="descriptionBox"
            style={[
              styles.postContent,
              globalStyles.flexc,
              { opacity: fadeAnim },
            ]}
          >
            <TextInput
              multiline
              placeholder="Comente aqui..."
              numberOfLines={5}
              textAlignVertical="top"
              keyboardType="default"
              value={description!}
              onChangeText={setDescription}
              style={{
                borderWidth: 1,
                borderColor: themeColors.text,
                borderRadius: 8,
                paddingHorizontal: 10,
                justifyContent: "center",
                paddingVertical: 16,
                minHeight: 100,
                height: "auto",
                width: "95%",
              }}
              placeholderTextColor={themeColors.textSecondary}
            />
            {!!image?.uri ? (
              <View style={{ position: "relative", width: "95%" }}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.postImagePost}
                  resizeMode="cover"
                ></Image>
                <TouchableOpacity
                  onPress={noImage}
                  style={[
                    globalStyles.flexr,
                    {
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      backgroundColor: themeColors.white,
                      borderWidth: 1,
                      borderColor: themeColors.black,
                      borderRadius: 50,
                      padding: 5,
                    },
                  ]}
                >
                  <FontAwesome
                    name="trash"
                    size={19}
                    color={themeColors.black}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              imageUrl && (
                <View style={{ position: "relative", width: "95%" }}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.postImagePost}
                    resizeMode="cover"
                  ></Image>
                  <TouchableOpacity
                    onPress={noImage}
                    style={[
                      globalStyles.flexr,
                      {
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 30,
                        height: 30,
                        backgroundColor: themeColors.white,
                        borderWidth: 1,
                        borderColor: themeColors.black,
                        borderRadius: 50,
                        padding: 5,
                      },
                    ]}
                  >
                    <FontAwesome
                      name="trash"
                      size={19}
                      color={themeColors.black}
                    />
                  </TouchableOpacity>
                </View>
              )
            )}
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingRight: 20,
              }}
            >
              <View style={{ width: "40%", paddingBottom: 10 }}>
                <MFSuccessButton
                  isLoading={isLoading}
                  disabled={isLoading}
                  themeColors={themeColors}
                  onPress={postId ? HandleEditPost : HandleSendPost}
                  title={isLoading === true ? "enviando..." : "Enviar"}
                ></MFSuccessButton>
              </View>
            </View>
          </Animated.View>
        ) : (
          <View></View>
        )}
      </View>
    </Pressable>
  );
}

export function MFShopTrainingCard({
  themeColors,
  data,
  onPress,
}: MFShopCardTrainingProps) {
  const { training, value, discount } = data;

  const averageEvaluation =
    training.trainingEvaluations.length > 0
      ? (
          training.trainingEvaluations.reduce(
            (acc: any, cur: any) => acc + cur.evaluation,
            0
          ) / training.trainingEvaluations.length
        ).toFixed(1)
      : "N/A";

  const finalPrice =
    discount > 0 ? (value - discount).toFixed(2) : value.toFixed(2);

  return (
    <TouchableOpacity
      style={[
        styles.shopTrainingCard,
        {
          backgroundColor: themeColors.secondary,
          shadowColor: themeColors.text,
          position: "relative",
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={{ uri: training.photo }}
        style={styles.shopTrainingImage}
      />
      <View style={styles.shopTrainingInfo}>
        <Text style={[styles.shopTrainingTitle, { color: themeColors.text }]}>
          {training.name}
        </Text>
        <View
          style={[
            globalStyles.flexr,
            {
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              marginBottom: 15,
            },
          ]}
        >
          <Text
            style={[
              styles.shopTrainingDescription,
              { color: themeColors.text, fontWeight: "400" },
            ]}
            numberOfLines={2}
          >
            Criado por:{" "}
          </Text>
          <View
            style={[
              globalStyles.flexr,
              {
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
              },
            ]}
          >
            <Text
              style={[styles.shopTrainingDescription, { fontWeight: "900" }]}
            >
              {training.user.nick ? training.user.nick : training.user.name}
            </Text>
            {training?.user?.cref && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                    marginLeft: 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: "#105661",
                  }}
                >
                  Cr
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: "#3F9933",
                  }}
                >
                  ef
                </Text>
                <FontAwesome
                  style={{ marginLeft: 5 }}
                  name="check-circle"
                  size={11}
                  color={themeColors.success}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={[
          styles.shopTrainingRow,
          { position: "absolute", top: 7, right: 7, gap: 10 },
        ]}
      >
        <View
          style={[
            styles.shopTrainingRating,
            { backgroundColor: themeColors.warning },
          ]}
        >
          <Text
            style={[
              styles.shopTrainingRatingText,
              { color: themeColors.black },
            ]}
          >
            <AntDesign name="star" size={14} color={themeColors.black} />{" "}
            {averageEvaluation}
          </Text>
        </View>
        <View
          style={[
            styles.shopTrainingRating,
            {
              backgroundColor: getLevel({ level: +data.training.level })
                ?.BCcolor,
            },
          ]}
        >
          <Text
            style={[
              styles.shopTrainingRatingText,
              { color: getLevel({ level: +data.training.level })?.FColor },
            ]}
          >
            {getLevel({ level: +data.training.level })?.name}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.shopTrainingPriceContainer,
          { position: "absolute", bottom: 10, right: 15 },
        ]}
      >
        {finalPrice > 0 ? (
          <>
            {discount > 0 && (
              <Text
                style={[
                  styles.shopTrainingOldPrice,
                  { color: themeColors.themeGrey },
                ]}
              >
                R$ {value.toFixed(2).replace(".", ",")}
              </Text>
            )}
            <Text
              style={[styles.shopTrainingPrice, { color: themeColors.primary }]}
            >
              R$ {finalPrice.replace(".", ",")}
            </Text>
          </>
        ) : (
          <View
            style={[
              styles.MFFreePrice,
              { backgroundColor: themeColors.success },
            ]}
          >
            <Text
              style={{
                color: themeColors.white,
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              GRATIS
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function MFMyFriendRequestCard({
  themeColors,
  data,
  accept,
  refuse,
  isLoading,
}: {
  themeColors: any;
  data: any;
  accept: () => void;
  refuse: () => void;
  isLoading?: boolean;
}) {
  const client = data?.client_friendship_senderToclient,
    [isClicked, setIsClicked] = useState<number>(0);

  return (
    <View>
      <View
        style={[
          styles.cardPost,
          {
            backgroundColor: themeColors.backgroundSecondary,
            borderWidth: 1,
            borderColor: themeColors.backgroundSecondary,
            position: "relative",
          },
        ]}
      >
        {isClicked === 0 ? (
          <View
            style={[
              globalStyles.flexr,
              { position: "absolute", top: 16, right: 20, padding: 5, gap: 25 },
            ]}
          >
            <Pressable
              onPress={
                !isLoading
                  ? () => {
                      accept();
                      setIsClicked(1);
                    }
                  : null
              }
            >
              <AntDesign
                name="checkcircle"
                size={36}
                color={themeColors.success}
              />
            </Pressable>
            <Pressable
              onPress={
                !isLoading
                  ? () => {
                      refuse();
                      setIsClicked(2);
                    }
                  : null
              }
            >
              <AntDesign
                name="closecircle"
                size={36}
                color={themeColors.danger}
              />
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              globalStyles.flexr,
              { position: "absolute", top: 16, right: 20, padding: 5, gap: 25 },
            ]}
          >
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor:
                  isClicked === 1 ? themeColors.success : themeColors.danger,
              }}
            >
              <Text
                style={{
                  color:
                    isClicked === 1 ? themeColors.success : themeColors.danger,
                }}
              >
                {isClicked === 1 ? "Aceito" : "Rejeitado"}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.headerPost}>
          {client?.photo ? (
            <Image
              source={{ uri: client?.photo }}
              style={[
                styles.avatarPost,
                { borderColor: themeColors.text, borderWidth: 3 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatarPost,
                {
                  backgroundColor: themeColors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: themeColors.text,
                  borderWidth: 3,
                },
              ]}
            >
              <Ionicons name="person" size={24} color={themeColors.primary} />
            </View>
          )}

          <View style={styles.authorInfoPost}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 2,
              }}
            >
              <Text
                style={[
                  styles.authorNamePost,
                  { color: themeColors.text, fontWeight: 800 },
                ]}
              >
                {!!client?.nick ? client?.nick : client?.name}
              </Text>
              {client?.userType && client?.userType === 1 && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/eai-bora/icon-eab.png")}
                    style={[
                      styles.adminImagePost,
                      { borderColor: themeColors.grey, padding: 2 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              )}
              {client?.userType &&
                (client?.userType === 3 || client?.userType === 4) && (
                  <View
                    style={[
                      globalStyles.flexr,
                      {
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="workspace-premium"
                      size={18}
                      color={
                        client?.userType === 3
                          ? themeColors.orange
                          : client?.userType === 4
                          ? themeColors.primary
                          : "black"
                      }
                    />
                  </View>
                )}
              {client?.cref && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: themeColors.grey,
                      borderWidth: 1,
                      alignItems: "center",
                      paddingHorizontal: 7,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#105661",
                    }}
                  >
                    Cr
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#3F9933",
                    }}
                  >
                    ef
                  </Text>
                  <FontAwesome
                    style={{ marginLeft: 5 }}
                    name="check-circle"
                    size={14}
                    color={themeColors.success}
                  />
                </View>
              )}
            </View>
            {!!data.createdAt || !!data.updatedAt ? (
              <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
                {data.updatedAt
                  ? `editado ${formatTimeAgo(data.updatedAt)}`
                  : formatTimeAgo(data.createdAt)}
                {"  "}
                <FontAwesome5
                  name="clock"
                  size={12}
                  color={themeColors.themeGrey}
                />
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export function MFPersonalRequestCard({
  themeColors,
  data,
  accept,
  refuse,
  isLoading,
}: {
  themeColors: any;
  data: any;
  accept: () => void;
  refuse: () => void;
  isLoading?: boolean;
}) {
  const client = data?.client_relationship_responsibleToclient,
    [isClicked, setIsClicked] = useState<number>(0);

  return (
    <View>
      <View
        style={[
          styles.cardPost,
          {
            backgroundColor: themeColors.backgroundSecondary,
            borderWidth: 1,
            borderColor: themeColors.backgroundSecondary,
            position: "relative",
          },
        ]}
      >
        {isClicked === 0 ? (
          <View
            style={[
              globalStyles.flexr,
              { position: "absolute", top: 16, right: 20, padding: 5, gap: 25 },
            ]}
          >
            <Pressable
              onPress={
                !isLoading
                  ? () => {
                      accept();
                      setIsClicked(1);
                    }
                  : null
              }
            >
              <AntDesign
                name="checkcircle"
                size={36}
                color={themeColors.success}
              />
            </Pressable>
            <Pressable
              onPress={
                !isLoading
                  ? () => {
                      refuse();
                      setIsClicked(2);
                    }
                  : null
              }
            >
              <AntDesign
                name="closecircle"
                size={36}
                color={themeColors.danger}
              />
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              globalStyles.flexr,
              { position: "absolute", top: 16, right: 20, padding: 5, gap: 25 },
            ]}
          >
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor:
                  isClicked === 1 ? themeColors.success : themeColors.danger,
              }}
            >
              <Text
                style={{
                  color:
                    isClicked === 1 ? themeColors.success : themeColors.danger,
                }}
              >
                {isClicked === 1 ? "Aceito" : "Rejeitado"}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.headerPost}>
          {client?.photo ? (
            <Image
              source={{ uri: client?.photo }}
              style={[
                styles.avatarPost,
                { borderColor: themeColors.text, borderWidth: 3 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatarPost,
                {
                  backgroundColor: themeColors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: themeColors.text,
                  borderWidth: 3,
                },
              ]}
            >
              <Ionicons name="person" size={24} color={themeColors.primary} />
            </View>
          )}

          <View style={styles.authorInfoPost}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 2,
              }}
            >
              <Text
                style={[
                  styles.authorNamePost,
                  { color: themeColors.text, fontWeight: 800 },
                ]}
              >
                {client?.name}
                <Text style={{ fontSize: 12 }}>
                  {client.nick ? `  (${client.nick})` : ""}
                </Text>
              </Text>
              {client?.userType && client?.userType === 1 && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/eai-bora/icon-eab.png")}
                    style={[
                      styles.adminImagePost,
                      { borderColor: themeColors.grey, padding: 2 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              )}
              {client?.userType &&
                (client?.userType === 3 || client?.userType === 4) && (
                  <View
                    style={[
                      globalStyles.flexr,
                      {
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="workspace-premium"
                      size={18}
                      color={
                        client?.userType === 3
                          ? themeColors.orange
                          : client?.userType === 4
                          ? themeColors.primary
                          : "black"
                      }
                    />
                  </View>
                )}
              {client?.cref && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: themeColors.grey,
                      borderWidth: 1,
                      alignItems: "center",
                      paddingHorizontal: 7,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#105661",
                    }}
                  >
                    Cr
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#3F9933",
                    }}
                  >
                    ef
                  </Text>
                  <FontAwesome
                    style={{ marginLeft: 5 }}
                    name="check-circle"
                    size={14}
                    color={themeColors.success}
                  />
                </View>
              )}
            </View>
            {!!data.createdAt || !!data.updatedAt ? (
              <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
                {data.updatedAt
                  ? `editado ${formatTimeAgo(data.updatedAt)}`
                  : formatTimeAgo(data.createdAt)}
                {"  "}
                <FontAwesome5
                  name="clock"
                  size={12}
                  color={themeColors.themeGrey}
                />
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export function MFPersonalInfoCard({
  themeColors,
  selectedPersonal,
  onPress,
  isLoading,
}: {
  themeColors: any;
  selectedPersonal: any;
  onPress: () => void;
  isLoading?: boolean;
}) {
  return (
    <View
      style={[
        styles.cardInfoPersonal,
        { backgroundColor: themeColors.secondary },
      ]}
    >
      <Image
        source={
          selectedPersonal.client_relationship_responsibleToclient
            .backgroundImage
            ? {
                uri: selectedPersonal.client_relationship_responsibleToclient
                  .backgroundImage,
              }
            : require("@/assets/images/eai-bora/eab-background-default.png")
        }
        style={styles.backgroundImageInfoPersonal}
      />
      <View style={styles.profileContainerInfoPersonal}>
        <Image
          source={{
            uri: selectedPersonal.client_relationship_responsibleToclient.photo,
          }}
          style={[
            styles.profileImageInfoPersonal,
            { borderColor: themeColors.secondary },
          ]}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <Text
            style={[
              styles.authorNamePost,
              { color: themeColors.text, fontWeight: 800 },
            ]}
          >
            {selectedPersonal.client_relationship_responsibleToclient?.name}
            <Text style={{ fontSize: 12 }}>
              {selectedPersonal.client_relationship_responsibleToclient.nick
                ? `  ( ${selectedPersonal.client_relationship_responsibleToclient.nick} )`
                : ""}
            </Text>
          </Text>
          {selectedPersonal.client_relationship_responsibleToclient?.userType &&
            selectedPersonal.client_relationship_responsibleToclient
              ?.userType === 1 && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  source={require("@/assets/images/eai-bora/icon-eab.png")}
                  style={[
                    styles.adminImagePost,
                    { borderColor: themeColors.grey, padding: 2 },
                  ]}
                  resizeMode="cover"
                />
              </View>
            )}
          {selectedPersonal.client_relationship_responsibleToclient?.userType &&
            (selectedPersonal.client_relationship_responsibleToclient
              ?.userType === 3 ||
              selectedPersonal.client_relationship_responsibleToclient
                ?.userType === 4) && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <MaterialIcons
                  name="workspace-premium"
                  size={18}
                  color={
                    selectedPersonal.client_relationship_responsibleToclient
                      ?.userType === 3
                      ? themeColors.orange
                      : selectedPersonal.client_relationship_responsibleToclient
                          ?.userType === 4
                      ? themeColors.primary
                      : "black"
                  }
                />
              </View>
            )}
          {selectedPersonal.client_relationship_responsibleToclient?.cref && (
            <View
              style={[
                globalStyles.flexr,
                {
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.grey,
                  borderWidth: 1,
                  alignItems: "center",
                  paddingHorizontal: 7,
                  borderRadius: 5,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: "#105661",
                }}
              >
                Cr
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: "#3F9933",
                }}
              >
                ef
              </Text>
              <FontAwesome
                style={{ marginLeft: 5 }}
                name="check-circle"
                size={14}
                color={themeColors.success}
              />
            </View>
          )}
        </View>
        {selectedPersonal.client_relationship_responsibleToclient.instagram && (
          <Text
            style={[styles.nickInfoPersonal, { color: themeColors.themeGrey }]}
          >
            @
            {selectedPersonal.client_relationship_responsibleToclient.instagram?.replaceAll(
              "@",
              ""
            )}
          </Text>
        )}
        {selectedPersonal.client_relationship_responsibleToclient
          .description && (
          <Text
            style={[
              styles.descriptionInfoPersonal,
              { color: themeColors.text },
            ]}
          >
            ss
            {
              selectedPersonal.client_relationship_responsibleToclient
                .description
            }
          </Text>
        )}
        {onPress && (
          <View style={styles.wtsppBoxInfoPersonal}>
            <Pressable
              onPress={onPress}
              style={[
                styles.wtsppBtnInfoPersonal,
                {
                  backgroundColor: themeColors.success,
                },
              ]}
            >
              <Text
                style={{
                  color: themeColors.white,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                MENSAGEM{"    "}
                <FontAwesome
                  name="whatsapp"
                  size={24}
                  color={themeColors.white}
                />
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export function MFPersonalEvaluationCard({
  themeColors,
  data,
  onPress,
  myself,
}: {
  themeColors: any;
  data: any;
  onPress: () => void;
  myself: boolean;
}) {
  const {
    evaluation,
    observations,
    createdAt,
    updatedAt,
    client_personalEvaluations_authorIdToclient,
  } = data;

  function getStars({ avaliation }: { avaliation: number }) {
    const stars = [];

    for (let index = 0; index < 5; index++) {
      const name = index < avaliation ? "star" : "star-o";

      stars.push(
        <FontAwesome key={index} name={name} size={18} color="#FFD700" />
      );
    }

    return stars;
  }

  return (
    <View
      style={[
        styles.cardPost,
        {
          backgroundColor: myself
            ? themeColors.backgroundSecondary
            : themeColors.secondary,
        },
      ]}
    >
      <View style={[styles.headerPost, { position: "relative" }]}>
        <Image
          source={{ uri: client_personalEvaluations_authorIdToclient?.photo }}
          style={[
            styles.avatarPost,
            {
              borderColor: myself ? themeColors.success : themeColors.secondary,
              borderWidth: 2,
            },
          ]}
        />
        <View style={styles.authorInfoPost}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 2,
            }}
          >
            <Text
              style={[
                styles.authorNamePost,
                { color: myself ? themeColors.success : themeColors.text },
              ]}
            >
              {myself
                ? "Você"
                : client_personalEvaluations_authorIdToclient.nick
                ? client_personalEvaluations_authorIdToclient.nick
                : client_personalEvaluations_authorIdToclient.name}
            </Text>
            {client_personalEvaluations_authorIdToclient?.userType &&
              client_personalEvaluations_authorIdToclient?.userType === 1 && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/eai-bora/icon-eab.png")}
                    style={[
                      styles.adminImagePost,
                      { borderColor: themeColors.grey, padding: 2 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              )}
            {client_personalEvaluations_authorIdToclient?.userType &&
              (client_personalEvaluations_authorIdToclient?.userType === 3 ||
                client_personalEvaluations_authorIdToclient?.userType ===
                  4) && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="workspace-premium"
                    size={18}
                    color={
                      client_personalEvaluations_authorIdToclient?.userType ===
                      3
                        ? themeColors.orange
                        : client_personalEvaluations_authorIdToclient?.userType ===
                          4
                        ? themeColors.primary
                        : "black"
                    }
                  />
                </View>
              )}
            {client_personalEvaluations_authorIdToclient?.cref && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#105661",
                  }}
                >
                  Cr
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#3F9933",
                  }}
                >
                  ef
                </Text>
                <FontAwesome
                  style={{ marginLeft: 5 }}
                  name="check-circle"
                  size={14}
                  color={themeColors.success}
                />
              </View>
            )}
          </View>
          {!!createdAt || !!updatedAt ? (
            <Text style={[styles.datePost, { color: themeColors.themeGrey }]}>
              {updatedAt
                ? `editado ${formatTimeAgo(updatedAt)}`
                : formatTimeAgo(createdAt)}
              {"  "}
              <FontAwesome5
                name="clock"
                size={12}
                color={themeColors.themeGrey}
              />
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bodyPost}>
        {evaluation && (
          <Text style={[styles.titlePost, { color: themeColors.text }]}>
            {getStars({ avaliation: evaluation })}
          </Text>
        )}
        {observations && (
          <Text style={[styles.descriptionPost, , { color: themeColors.text }]}>
            {observations}
          </Text>
        )}
      </View>
    </View>
  );
}

export function MFClientCard({
  themeColors,
  data,
  friendStatus,
  onPress,
}: {
  themeColors: any;
  data: any;
  friendStatus: number;
  onPress: () => void;
}) {
  return (
    <View
      style={[
        styles.cardPost,
        {
          backgroundColor: themeColors.secondary,
          marginBottom: 10,
          paddingBottom: 0,
        },
      ]}
    >
      <View
        style={[
          styles.headerPost,
          { position: "relative", alignItems: "center" },
        ]}
      >
        <MFAddFriendButton
          title=""
          themeColors={themeColors}
          type={friendStatus}
          onPress={onPress}
        ></MFAddFriendButton>
        {data?.photo ? (
          <Image
            source={{ uri: data?.photo }}
            style={styles.avatarClientPost}
          />
        ) : (
          <View style={[globalStyles.flexc, styles.avatarClientPost]}>
            <FontAwesome name="user-circle" size={55} color="black" />
          </View>
        )}

        <View style={styles.authorInfoPost}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Text style={[styles.authorNamePost, { color: themeColors.text }]}>
              {data.nick ? data.nick : data.name}
            </Text>
            {data?.userType && data?.userType === 1 && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  source={require("@/assets/images/eai-bora/icon-eab.png")}
                  style={[
                    styles.adminImagePost,
                    { borderColor: themeColors.grey, padding: 2 },
                  ]}
                  resizeMode="cover"
                />
              </View>
            )}
            {data?.userType &&
              (data?.userType === 3 || data?.userType === 4) && (
                <View
                  style={[
                    globalStyles.flexr,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="workspace-premium"
                    size={18}
                    color={
                      data?.userType === 3
                        ? themeColors.orange
                        : data?.userType === 4
                        ? themeColors.primary
                        : "black"
                    }
                  />
                </View>
              )}
            {data?.cref && (
              <View
                style={[
                  globalStyles.flexr,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.grey,
                    borderWidth: 1,
                    alignItems: "center",
                    paddingHorizontal: 7,
                    borderRadius: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#105661",
                  }}
                >
                  Cr
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#3F9933",
                  }}
                >
                  ef
                </Text>
                <FontAwesome
                  style={{ marginLeft: 5 }}
                  name="check-circle"
                  size={14}
                  color={themeColors.success}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export function MFPersonCard({
  themeColors,
  person,
  friendshipStatus,
  onAddFriend,
  onPress,
  isLoading,
}: {
  themeColors: any;
  person: any;
  friendshipStatus: number; // 1=não amigo, 2=amigo, 3=pedido enviado, 4=pedido recebido
  onAddFriend: () => void;
  onPress?: () => void;
  isLoading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        backgroundColor: themeColors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: themeColors.grey,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Foto */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: themeColors.grey,
            overflow: "hidden",
            marginRight: 16,
          }}
        >
          {person?.photo ? (
            <Image
              source={{ uri: person.photo }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: themeColors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "900",
                  color: themeColors.white,
                }}
              >
                {person?.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
        </View>

        {/* Informações */}
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 18,
                fontWeight: "900",
                color: themeColors.text,
                flex: 1,
              }}
            >
              {person?.name}
            </Text>
            {person?.userType === 3 && (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.orange,
                  borderWidth: 1.5,
                  alignItems: "center",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: themeColors.orange,
                    fontWeight: "900",
                    fontSize: 11,
                  }}
                >
                  PRO
                </Text>
                <FontAwesome
                  style={{ marginLeft: 4 }}
                  name="check-circle"
                  size={12}
                  color={themeColors.orange}
                />
              </View>
            )}
          </View>

          {person?.nick && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: themeColors.info,
                marginBottom: 4,
                fontWeight: "600",
              }}
            >
              @{person.nick}
            </Text>
          )}

          {person?.description && (
            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                color: themeColors.textSecondary,
                lineHeight: 18,
              }}
            >
              {person.description}
            </Text>
          )}
        </View>
      </View>

      {/* Botão de amizade */}
      <View style={{ marginTop: 12 }}>
        <MFAddFriendButton
          title=""
          themeColors={themeColors}
          type={friendshipStatus}
          onPress={onAddFriend}
          fullWidth={true}
        />
      </View>
    </Pressable>
  );
}
