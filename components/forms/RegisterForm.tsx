import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Animated,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useToast } from "@/contexts/ToastContext";
import CustomText from "../CustomText";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [formState, setFormState] = useState("email");
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [four, setFour] = useState("");

  const verificationCode = `${one}${two}${three}${four}`;

  const { showToast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!isCodeSent) {
        const response = await axios.post(
          "https://ifranex.vercel.app/api/auth/send-code",
          { email }
        );
        if (response.status === 200) {
          showToast("Verification code sent to your email.", "success");
          setIsCodeSent(true);
          setFormState("verification");
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to send verification code."
          );
        }
      } else {
        if (!email || !verificationCode || !username || !password) {
          Alert.alert("Error", "Please fill all fields.");
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          Alert.alert("Error", "Password must be at least 8 characters long.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://ifranex.vercel.app/api/auth/sign-up",
          {
            email,
            verificationCode,
            username,
            password,
          }
        );

        if (response.status === 200) {
          showToast("Account created successfully", "success");
          // navigation.navigate('Services'); // Update to your navigation route
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to create account."
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (
    value: string,
    setter: (arg0: string) => void,
    index: number
  ) => {
    if (value.length === 1) {
      setter(value);
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value.length === 0) {
      setter("");
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (value.length === 4) {
      const values = value.split("");
      setOne(values[0]);
      setTwo(values[1]);
      setThree(values[2]);
      setFour(values[3]);
      inputRefs.current[3]?.focus();
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 pt-6">
          <TouchableOpacity className="absolute top-4 right-4 z-10">
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            className="w-16 h-16 self-center mb-6"
            resizeMode="contain"
          />

          <CustomText className="text-3xl font-bold mb-8 text-center">
            Create account
          </CustomText>

          {formState === "email" && (
            <Animated.View className="bg-white p-6">
              <CustomText className="text-xl text-gray-900 mb-2 font-semibold">
                Email
              </CustomText>
              <View className="mb-4 flex-row items-center bg-slate-100 focus:border border-gray-300 rounded-full p-4 focus:border-primaryColor">
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
              <TouchableOpacity
                className={`bg-primaryColor rounded-full py-4 ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <CustomText className="text-[#fff] text-center font-bold text-lg">
                    Send verification code
                  </CustomText>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {formState === "verification" && isCodeSent && (
            <Animated.View className="bg-white p-6 rounded-full">
              <CustomText className="text-lg text-gray-900 mb-4 font-semibold text-center">
                Enter the verification code sent to your email
              </CustomText>
              <View className="flex-row justify-between mb-6">
                {[setOne, setTwo, setThree, setFour].map((setter, index) => (
                  <TextInput
                    key={index}
                    className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl bg-slate-50"
                    value={[one, two, three, four][index]}
                    onChangeText={(value) =>
                      handleVerificationCodeChange(value, setter, index)
                    }
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    keyboardType="numeric"
                  />
                ))}
              </View>

              <View className="mb-4">
                <CustomText className="text-xl text-gray-900 mb-2 font-semibold">
                  Username
                </CustomText>

                <View className="flex-row focus:border bg-slate-100 focus:border-primaryColor items-center rounded-full p-4">
                  <Feather
                    name="user"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="flex-1"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>
              <View className="mb-4">
                <CustomText className="text-xl text-gray-900 mb-2 font-semibold">
                  Password
                </CustomText>
                <View className="flex-row focus:border bg-slate-100 focus:border-primaryColor items-center rounded-full p-4">
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
              <TouchableOpacity
                className={`bg-primaryColor rounded-full py-4 ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleSubmit}
                disabled={loading}
              >
                <CustomText className="text-white text-center font-bold text-lg">
                  {loading ? "Creating Account..." : "Create Account"}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity
            className="self-center mt-6"
            onPress={() => router.replace("/(auth)/login")}
          >
            <CustomText className="text-center font-semibold text-lg">
              Already have an account?{" "}
              <CustomText className="text-primaryColor">Login</CustomText>
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterForm;
