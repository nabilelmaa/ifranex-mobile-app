import React, { useState, useRef, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useToast } from "@/contexts/ToastContext";
import CustomText from "../CustomText";
import { useRouter } from "expo-router";


const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { showToast } = useToast();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://ifranex.vercel.app/api/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("authToken", data.token);
        showToast("Login successful", "success");

        router.replace("/home");
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 mt-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-16 h-16 mb-6 self-center"
            resizeMode="contain"
          />

          <CustomText className="text-3xl font-bold mb-8 text-center">
            Welcome Back 👋
          </CustomText>

          <Animated.View className="bg-white p-6">
            <View className="mb-4">
              <CustomText className="text-xl text-gray-900 mb-2 font-semibold">
                Email
              </CustomText>
              <View className="flex-row items-center bg-slate-100 focus:border border-gray-200 rounded-full p-4 focus:border-primaryColor">
                <Feather name="mail" size={20} color="gray" className="mr-3" />
                <TextInput
                  className="flex-1 ml-3"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-4">
              <CustomText className="text-xl text-gray-900 mb-2 font-semibold">
                Password
              </CustomText>
              <View className="flex-row items-center bg-slate-100 focus:border border-gray-200 rounded-full p-4 focus:border-primaryColor">
                <Feather name="lock" size={20} color="gray" className="mr-3" />
                <TextInput
                  className="flex-1 ml-3"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="self-end mb-6">
              <CustomText className="text-xl text-primaryColor font-semibold">
                Forgot Password?
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-primaryColor rounded-full py-4 ${
                loading ? "opacity-50" : ""
              }`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <CustomText className="text-[#fff] text-center font-bold text-lg">
                  Log In
                </CustomText>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/register")}
            className="self-center mt-6"
          >
            <CustomText className="text-center font-semibold text-lg">
              Don't have an account?{" "}
              <CustomText className="text-primaryColor">Register</CustomText>
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginForm;
