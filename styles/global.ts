import {
  StyleSheet
} from "react-native";

export const globalStyles = StyleSheet.create({
  flexr: {
    display:'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },
  flexc: {
    display:'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height:60,
    backgroundColor: "#f5f5f5",
    display: 'flex',
    flexDirection:'row',
    alignItems: "center",
    justifyContent: "flex-start",
    position: 'relative',
    paddingHorizontal: 20,
  },
  stackHeader: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  stackBackButton: {
    display: 'flex',
    flexDirection:'row',
    alignItems: "center",
    justifyContent: "center",
    gap: 20
  },
  headerImageBox: {
    width: 190,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    objectFit: 'contain',
    width: 180,
    height:31
  },
  headerThemeBtn: {
    position: 'absolute',
    right:15
  },
  headerInfoBox: {
    width: '100%',
    flex: 1,
    maxHeight: '85%',
    
  },
  headerInfoPhoto: {
    width: 220,
    height: 'auto',
    alignItems: "center",
    justifyContent: "center",
    display: 'flex',
  },
  headerPhoto: {
    width: 70,
    height: 70,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    display: 'flex',
  },
  headerInfoContent: {
    width: '100%',
    height: 'auto',
    alignItems: "flex-start",
    justifyContent: "flex-start",
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10,
    marginTop:20
  },
  headerInfoText: {
    alignItems: "center",
    justifyContent: "center",
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    textAlign:'center'
  },
  themeBtnBox: {
    width: '100%',
    alignItems: "flex-end",
    justifyContent: "flex-start",
    display: 'flex',
    flexDirection: 'row'
  }
  });
  