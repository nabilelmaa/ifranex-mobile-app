import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

type TabIconProps = {
  name: FeatherIconName;
  color: string;
  focused: boolean;
  label: string;
};

const TabIcon: React.FC<TabIconProps> = ({ name, color, focused, label }) => {
    return (
      <View className="items-center justify-center">
  
        <Feather name={name} size={24} color={color} />
        
   
        <Text
          style={{
            color: focused ? "#4f46e5" : "#000", 
            marginTop: 4,
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </View>
    );
  };
  

type CustomTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View
      className="flex-row bg-white p-2 rounded-t-xl shadow-lg"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: FeatherIconName;
        switch (route.name) {
          case "home":
            iconName = "home";
            break;
          case "history":
            iconName = "clock";
            break;
          case "profile":
            iconName = "user";
            break;
          case "inbox":
            iconName = "inbox";
            break;
          default:
            iconName = "circle";
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
            style={{ paddingVertical: 10 }}
          >
            <TabIcon
              name={iconName}
              color={isFocused ? "#4f46e5" : "#000"}
              focused={isFocused}
              label={label}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default Layout;
