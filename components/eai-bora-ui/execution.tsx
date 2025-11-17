import { globalStyles } from "@/styles/global";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native";
import {
  MFDefaultNoPadCard,
  MFExerciseExecuteClosedCard,
  MFExerciseExecuteOppenedCard,
} from "./cards";

interface MFExecutionViewProps extends ViewProps {
  themeColors?: any;
  training?: any;
  series?: any;
  clockData?: any;
  setSeriesList: (series: any) => void;
  muscleGroups?: any;
  openTrainingInfo: () => void;
  setClockData: ({
    name,
    interval,
  }: {
    name: string | undefined;
    interval: string | undefined;
  }) => void;
  FinishTrainingHandle: ({
    exerciseId,
    difficulty,
  }: {
    exerciseId: number;
    difficulty: string[];
  }) => Promise<boolean>;
  isTrainingComplete?: boolean;
}

export function MFTrainingExecutionView({
  themeColors,
  training,
  series,
  setSeriesList,
  muscleGroups,
  setClockData,
  FinishTrainingHandle,
  clockData,
  isTrainingComplete,
  openTrainingInfo,
}: MFExecutionViewProps) {
  const { width } = useWindowDimensions();
  const [exerciseOpened, setExerciseOpened] = useState<number | null>(null);

  function SeriesListChange(
    exerciseId: number,
    difficultyIndex: number,
    newW: string
  ) {
    const updatedSeries = [...series];
    const updatedDifficulties = [...updatedSeries[exerciseId].difficulty];
    updatedDifficulties[difficultyIndex] = newW;
    updatedSeries[exerciseId] = {
      ...updatedSeries[exerciseId],
      difficulty: updatedDifficulties,
    };
    setSeriesList(updatedSeries);
  }

  function GetGroupProps(id: number) {
    const x = muscleGroups.find((a: any) => a.id === id);

    return x;
  }

  useEffect(() => {
    if (clockData?.id) {
      setExerciseOpened(clockData?.id);
    }
  }, [clockData]);

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
          styles.boxImage,
          {
            backgroundColor: themeColors.secondary,
            shadowColor: themeColors.text,
          },
        ]}
      >
        <TouchableOpacity
          onPress={(e: any) => {
            e.stopPropagation();
            openTrainingInfo();
          }}
          style={[
            globalStyles.headerThemeBtn,
            {
              zIndex: 10,
              backgroundColor: themeColors.black,
              borderRadius: 100,
              padding: 2,
            },
          ]}
        >
          <AntDesign name="infocirlce" size={28} color={themeColors.white} />
        </TouchableOpacity>
        <ImageBackground
          source={
            training?.training?.photo
              ? { uri: training?.training?.photo }
              : require("@/assets/images/eai-bora/eab-background-default.png")
          }
          style={[styles.imageStyle, { backgroundColor: themeColors.primary }]}
          imageStyle={{
            resizeMode: "cover",
            width: width,
            height: "100%",
            alignSelf: "center",
          }}
        ></ImageBackground>
      </View>
      <View style={styles.boxExercises}>
        {series &&
          series.map((e: any, a: number) => {
            const props = GetGroupProps(e?.exercise?.groupMuscleId);
            return (
              <View key={e.id} style={styles.boxSingleExercise}>
                <MFDefaultNoPadCard themeColors={themeColors}>
                  {exerciseOpened && exerciseOpened === e.id ? (
                    <MFExerciseExecuteOppenedCard
                      themeColors={themeColors}
                      exerciseOpened={exerciseOpened}
                      setExerciseOpened={setExerciseOpened}
                      e={e}
                      a={a}
                      props={props}
                      SeriesListChange={SeriesListChange}
                      FinishTrainingHandle={FinishTrainingHandle}
                      next={clockData?.id}
                    ></MFExerciseExecuteOppenedCard>
                  ) : (
                    <MFExerciseExecuteClosedCard
                      themeColors={themeColors}
                      exerciseOpened={exerciseOpened}
                      setExerciseOpened={setExerciseOpened}
                      e={e}
                      a={a}
                      props={props}
                      SeriesListChange={SeriesListChange}
                      FinishTrainingHandle={FinishTrainingHandle}
                      next={clockData?.id}
                    ></MFExerciseExecuteClosedCard>
                  )}
                </MFDefaultNoPadCard>
              </View>
            );
          })}
        <View style={{ height: 60 }}></View>
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
    marginBottom: 30,
  },
  boxImage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
  imageStyle: {
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
  boxExercises: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    gap: 25,
    marginTop: -30,
  },
  boxSingleExercise: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    paddingHorizontal: 15,
  },
  exerciseMain: {
    width: "100%",
    minHeight: 75,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 60,
    // paddingLeft: 12,
    // paddingRight: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  exerciseInfoBtn: {
    position: "absolute",
    // top: -8,
    left: 8,
    borderWidth: 2,
    borderRadius: 100,
  },
  exerciseCheckBtn: {
    position: "absolute",
    right: 8,
    borderRadius: 100,
  },
  boxInfoSampleExercises: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  boxInfoSampleW: {
    display: "flex",
    flexDirection: "row",
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
});
