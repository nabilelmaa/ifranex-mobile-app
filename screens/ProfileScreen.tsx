import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../components/CustomText";
import { User } from "@/types/index";

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(
          "https://ifranex.vercel.app/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user data:", data.message);
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No user data found. Please log in again.</Text>
      </View>
    );
  }

  const settingsItems = [
    { icon: "person", label: "Account", color: "#FF69B4" },
    { icon: "lock-closed", label: "Privacy", color: "#20B2AA" },
    { icon: "shield", label: "Security", color: "#20B2AA" },
    { icon: "help-circle", label: "Help", color: "#20B2AA" },
    { icon: "information-circle", label: "About", color: "#20B2AA" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View className="items-center mb-6">
        <Image
          source={{
            uri: user.profilePicture || "https://via.placeholder.com/100",
          }}
          className="w-24 h-24 rounded-full mb-2"
          resizeMode="cover"
        />
        <Text className="text-xl font-semibold">{user.username}</Text>
      </View>

      <Text className="text-2xl font-bold mb-4">Settings</Text>

      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="flex-row items-center py-3"
          onPress={() => console.log(`Navigate to ${item.label}`)}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: item.color }}
          >
            <Ionicons name={item.icon as any} size={20} color="white" />
          </View>
          <Text className="flex-1">{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className="bg-red-500 p-4 rounded-lg items-center mt-8"
        onPress={handleLogout}
      >
        <CustomText className="text-white font-semibold">Log Out</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
