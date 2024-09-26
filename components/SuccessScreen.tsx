import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import CustomText from "./CustomText"; 

const VerificationSuccess = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="bg-white p-6 rounded-xl shadow-md">
        <Image
          source={require("../../assets/images/success.png")} // Add a suitable success image
          style={{ width: 100, height: 100 }}
        />
        <CustomText className="text-center text-2xl font-bold text-green-600 my-4">
          Verified!
        </CustomText>
        <CustomText className="text-center text-gray-700 mb-6">
          You have successfully verified your account.
        </CustomText>
        <TouchableOpacity
          onPress={() => router.push("/home")} // Navigate to home or relevant screen
          className="bg-primaryColor rounded-full py-4 px-8"
        >
          <Text className="text-white text-center font-bold text-lg">
            Browse Home
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-6"
        onPress={() => router.replace("/(auth)/login")}
      >
        <CustomText className="text-center text-gray-700">
          Already have an account?{" "}
          <CustomText className="text-primaryColor">Log in</CustomText>
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationSuccess;
