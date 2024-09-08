import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useToast } from "@/contexts/ToastContext";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "../CustomText";
import { useRouter } from "expo-router";

const { height, width } = Dimensions.get("window");

interface LoginFormProps {
  slideAnim: Animated.Value;
  handleHideForm: () => void;
  onSwitchForm: (formType: "login" | "register") => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  slideAnim,
  handleHideForm,
  onSwitchForm,
}) => {
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
        showToast("Login successful", "success");
        // router.replace("/home");
      } else {
        showToast(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      }}
      className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-lg h-5/6"
    >
      <LinearGradient
        colors={["#c7d2fe", "#a5b4fc", "#818cf8"]}
        className="absolute top-0 left-0 right-0 h-40 rounded-t-3xl"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-16">
          <TouchableOpacity
            className="absolute top-4 right-4 z-10"
            onPress={handleHideForm}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            className="w-16 h-16 mb-12 self-center"
            resizeMode="contain"
          />

          <CustomText className="text-3xl font-bold mb-8 text-center text-black">
            Welcome Back
          </CustomText>

          <Animated.View className="bg-white p-6 rounded-xl shadow-md">
            <View className="mb-4">
              <CustomText className="text-gray-600 mb-2 font-semibold">
                Email
              </CustomText>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-3">
                <Feather
                  name="mail"
                  size={20}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-4">
              <CustomText className="text-gray-600 mb-2 font-semibold">
                Password
              </CustomText>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-3">
                <Feather
                  name="lock"
                  size={20}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1"
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
              <CustomText className="text-indigo-600 font-semibold">
                Forgot Password?
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-indigo-600 rounded-lg py-4 ${
                loading ? "opacity-50" : ""
              }`}
              onPress={handleLogin}
              disabled={loading}
            >
              <CustomText className="text-white text-center font-bold text-lg">
                {loading ? "Logging in..." : "Log In"}
              </CustomText>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            className="self-center mt-6"
            onPress={() => onSwitchForm("register")}
          >
            <CustomText className="text-center font-semibold text-lg">
              Don't have an account?{" "}
              <CustomText className="text-indigo-600">Register</CustomText>
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default LoginForm;
