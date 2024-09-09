import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Home from "../../../screens/HomeScreen";

const HomeScreen = () => {
  return (
    <SafeAreaView className="h-screen bg-green-500">
      <Home />
    </SafeAreaView>
  );
};

export default HomeScreen;
