import React, { useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../../components/CustomText";
import { ArrowRight } from "lucide-react-native";
import { router } from "expo-router";

const IMAGES = [
  require("../../assets/images/cleaning.jpg"),
  require("../../assets/images/cleaning-2.jpg"),
  require("../../assets/images/cleaning-3.webp"),
];

const TITLES = [
  "Easy Cleaning Solutions at Your Fingertips",
  "Effortless Booking for Professional Cleaning",
  "Reliable Cleaning Services, Anytime, Anywhere",
];

const DESCRIPTIONS = [
  "Experience convenient and professional cleaning services tailored to your needs.",
  "Book expert cleaners effortlessly with just a few clicks and enjoy peace of mind.",
  "Get top-quality cleaning services at your convenience, wherever and whenever you need.",
];

const { width, height } = Dimensions.get("window");

const Home = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  const handleNext = () => {
    if (currentIndex.current < IMAGES.length - 1) {
      currentIndex.current += 1;
      scrollViewRef.current?.scrollTo({
        x: width * currentIndex.current,
        animated: true,
      });
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {IMAGES.map((image, index) => (
          <View
            key={index}
            style={{ width }}
            className="flex-1 items-center justify-center p-4"
          >
            <View className="w-full aspect-square rounded-full bg-blue-100 items-center justify-center overflow-hidden">
              <Image
                source={image}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <CustomText className="text-2xl font-bold text-center mt-8 px-4">
              {TITLES[index]}
            </CustomText>

            <CustomText className="text-lg text-gray-400 text-center mt-8 px-4">
              {DESCRIPTIONS[index]}
            </CustomText>

            <View className="flex-row justify-center space-x-2 mt-8">
              {IMAGES.map((_, dotIndex) => {
                const opacity = scrollX.interpolate({
                  inputRange: [
                    width * (dotIndex - 1),
                    width * dotIndex,
                    width * (dotIndex + 1),
                  ],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={dotIndex}
                    className="w-12 h-1 rounded-sm bg-primaryColor"
                    style={{ opacity }}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-8 w-full px-4">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-primaryColor rounded-full py-4 flex-row items-center justify-center"
        >
          <CustomText className="text-white text-center font-bold text-xl mr-2">
            {currentIndex.current === IMAGES.length - 1
              ? "Get Started"
              : "Next"}
          </CustomText>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
