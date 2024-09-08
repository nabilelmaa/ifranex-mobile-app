import React, { useState, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import { ArrowRight } from "lucide-react-native";

const IMAGES = [
  require("../assets/images/cleaning.jpg"),
  require("../assets/images/cleaning-2.jpg"),
  require("../assets/images/cleaning.jpg"),
];

const TITLES = [
  "Easy to your Cleaning Service System",
  "Professional Cleaning at Your Fingertips",
  "Easy to your Cleaning Service System",
];

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState<"login" | "register" | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const handleNext = () => {
    if (currentIndex < IMAGES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleShowForm("login");
    }
  };

  const handleShowForm = (formType: "login" | "register") => {
    setShowForm(formType);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleHideForm = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowForm(null));
  };

  const isLastImage = currentIndex === IMAGES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-between p-4">
          <View className="w-full aspect-square rounded-full bg-blue-100 items-center justify-center overflow-hidden">
            <Image
              source={IMAGES[currentIndex]}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <CustomText className="text-2xl font-bold text-center mt-8 px-4">
            {TITLES[currentIndex]}
          </CustomText>

          <View className="flex-row justify-center space-x-2 mt-8">
            {IMAGES.map((_, index) => (
              <View
                key={index}
                className={`w-2.5 h-2.5 rounded-sm ${
                  index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
                }`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="w-full bg-indigo-600 rounded-lg py-4 mt-8 flex-row items-center justify-center"
          >
            <CustomText className="text-white text-center font-bold text-lg mr-2">
              {isLastImage ? "Login" : "Next"}
            </CustomText>
            <ArrowRight color="white" size={20} />
          </TouchableOpacity>

          {!isLastImage && (
            <TouchableOpacity onPress={() => handleShowForm("login")}>
              <CustomText className="mt-4 text-lg">
                Already have an account?{" "}
                <CustomText className="text-indigo-600">Sign In</CustomText>
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {showForm && (
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
          }}
        >
          {showForm === "login" && (
            <LoginForm
              slideAnim={slideAnim}
              handleHideForm={handleHideForm}
              onSwitchForm={handleShowForm}
            />
          )}
          {showForm === "register" && (
            <RegisterForm
              slideAnim={slideAnim}
              handleHideForm={handleHideForm}
              onSwitchForm={handleShowForm}
            />
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Home;
