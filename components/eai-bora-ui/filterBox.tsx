import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";

interface MFDefaultCardProps extends ViewProps {
  themeColors?: any;
  search: string | undefined;
  isLoading: boolean;
  setSearch: (value: any) => void;
  onPress: () => void;
  placeholder?: string;
}

export default function MFFilterSortBox({
  themeColors,
  search,
  setSearch,
  isLoading,
  onPress,
  placeholder = "Buscar usuários...",
}: MFDefaultCardProps) {
  return (
    <View style={styles.box}>
      <View
        style={[
          styles.search,
          { borderWidth: 1, borderColor: themeColors.text, borderRadius: 8 },
        ]}
      >
        <TextInput
          style={[styles.input, { color: themeColors?.text || "#333" }]}
          value={search}
          onChangeText={setSearch}
          placeholder={placeholder}
          placeholderTextColor={themeColors?.themeGrey || "#aaa"}
        />
      </View>
      <Pressable
        onPress={onPress}
        style={[styles.btn, { backgroundColor: themeColors.grey }]}
      >
        {isLoading ? (
          <Text>...</Text>
        ) : (
          <FontAwesome name="search" size={20} color={themeColors.text} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  search: {
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  btn: {
    width: "20%",
    paddingHorizontal: 15,
    paddingVertical: 8,
    height: 43,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: {
    fontWeight: "600",
  },
});
