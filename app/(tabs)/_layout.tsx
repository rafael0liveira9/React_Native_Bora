import MFMainHeader from "@/components/eai-bora-ui/header";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { useViewMode } from "@/context/ViewModeContext";
// import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const { theme, toggleTheme } = useTheme();
  const { viewMode } = useViewMode();
  const [isHeaderInfoOpen, setisHeaderInfoOpen] = useState(false);
  const themeColors = Colors[theme];

  const CustomTabBarButton = (props: any) => {
    const isSelected = props?.accessibilityState?.selected ?? false;

    return (
      <TouchableOpacity
        {...props}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: isSelected ? 2 : 0,
          padding: 5,
        }}
      >
        {props.children}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[theme].tint,
          headerShown: true,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            padding: 0,
            margin: 0,
          },
          tabBarIconStyle: {
            width: "100%",
            height: 55,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
            margin: 0,
            borderWidth: 0,
          },
          tabBarStyle: {
            width: "100%",
            height: 55,
            elevation: 5,
            borderTopWidth: 1,
            borderColor: themeColors.secondary,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            backgroundColor: themeColors.secondary,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            header: () => (
              <MFMainHeader
                themeColors={themeColors}
                theme={theme}
                toggleTheme={toggleTheme}
                isOpen={isHeaderInfoOpen}
                setIsOpen={setisHeaderInfoOpen}
              />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopWidth: focused ? 3 : 0,
                  borderColor: themeColors.primary,
                }}
              >
                <Entypo name="home" size={focused ? 29 : 18} color={color} />
              </View>
            ),
          }}
        />
        {/* Aba Events - visível para todos */}
        <Tabs.Screen
          name="events"
          options={{
            header: () => (
              <MFMainHeader
                themeColors={themeColors}
                theme={theme}
                toggleTheme={toggleTheme}
                isOpen={isHeaderInfoOpen}
                setIsOpen={setisHeaderInfoOpen}
              />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopWidth: focused ? 3 : 0,
                  borderColor: themeColors.primary,
                }}
              >
                <Ionicons
                  name="calendar"
                  size={focused ? 29 : 18}
                  color={color}
                />
              </View>
            ),
          }}
        />
        {/* Aba People - apenas para modo cliente */}
        <Tabs.Screen
          name="people"
          options={{
            href: viewMode === "client" ? "/(tabs)/people" : null,
            header: () => (
              <MFMainHeader
                themeColors={themeColors}
                theme={theme}
                toggleTheme={toggleTheme}
                isOpen={isHeaderInfoOpen}
                setIsOpen={setisHeaderInfoOpen}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopWidth: focused ? 3 : 0,
                  borderColor: themeColors.primary,
                }}
              >
                <Ionicons
                  name="people"
                  size={focused ? 29 : 18}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
