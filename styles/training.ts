import {
    StyleSheet
} from "react-native";

export const trainingStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    noTrainingBox: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 20,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    fitinhoImage: {
        width: '30%',
        height:200
    },
    listBox: {
        width: '100%',
        height:'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        minHeight:200
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
    top: {
        width: "100%",
        height: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        margin: 0,
        padding: 0,
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
    trainingTabsBox: {
        width: '100%',
        padding: 0,
        margin: 0,
        marginBottom:60,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderBottomWidth:1
    },
    trainingTab: {
        width: '43%',
        height:30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    }
  });
  