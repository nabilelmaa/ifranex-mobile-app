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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useToast } from "@/contexts/ToastContext";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "../CustomText";

interface RegisterFormProps {
  slideAnim: Animated.Value;
  handleHideForm: () => void;
  onSwitchForm: (formType: "login" | "register") => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  slideAnim,
  handleHideForm,
  onSwitchForm,
}) => {
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
            className="w-16 h-16 self-center mb-12"
            resizeMode="contain"
          />

          <CustomText className="text-3xl font-bold mb-8 text-center text-black mt-2">
            Create Account
          </CustomText>

          {formState === "email" && (
            <Animated.View className="bg-white p-6 rounded-xl shadow-md">
              <CustomText className="CustomText-gray-600 mb-2 font-semibold">Email</CustomText>
              <View className="mb-4 flex-row items-center border border-gray-300 rounded-lg p-3">
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
                className={`bg-indigo-600 rounded-lg py-4 ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleSubmit}
                disabled={loading}
              >
                <CustomText className="text-white text-center font-bold text-lg">
                  {loading ? "Sending code..." : "Send Verification Code"}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          )}

          {formState === "verification" && isCodeSent && (
            <Animated.View className="bg-white p-6 rounded-xl shadow-md">
              <CustomText className="text-gray-600 mb-4 font-semibold text-center">
                Enter the verification code sent to your email
              </CustomText>
              <View className="flex-row justify-between mb-6">
                {[setOne, setTwo, setThree, setFour].map((setter, index) => (
                  <TextInput
                    key={index}
                    className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl bg-gray-100"
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
              <TextInput
                className="border border-gray-300 rounded-lg p-4 mb-4"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
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
              <TouchableOpacity
                className={`bg-indigo-600 rounded-lg py-4 ${
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
            onPress={() => onSwitchForm("login")}
          >
            <CustomText className="text-center font-semibold text-lg">
              Already have an account?{" "}
              <CustomText className="text-indigo-600">Login</CustomText>
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default RegisterForm;
