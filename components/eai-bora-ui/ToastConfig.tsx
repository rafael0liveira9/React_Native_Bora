import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <View
      style={{
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#10B981",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: "400",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  error: (props: any) => (
    <View
      style={{
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#EF4444",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="close-circle" size={24} color="#FFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: "400",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  info: (props: any) => (
    <View
      style={{
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#3B82F6",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="information-circle" size={24} color="#FFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: "400",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  warning: (props: any) => (
    <View
      style={{
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#F59E0B",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="warning" size={24} color="#FFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: "400",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),
};
