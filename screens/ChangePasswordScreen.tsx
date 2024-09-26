import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async () => {
    // Implement password change logic here
    console.log("Change password logic to be implemented");
    // After successful password change:
    router.back();
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Change Password",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.navigate("/profile")}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View className="space-y-4">
        <View>
          <Text className="text-gray-400 mb-1">Current Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#666"
          />
        </View>
        <View>
          <Text className="text-gray-400 mb-1">New Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#666"
          />
        </View>
        <View>
          <Text className="text-gray-400 mb-1">Confirm New Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity 
          className="bg-green-500 p-4 rounded-lg items-center mt-4"
          onPress={handleChangePassword}
        >
          <Text className="text-white font-semibold">Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
