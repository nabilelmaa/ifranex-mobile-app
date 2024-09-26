import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import History from "../../../screens/HistoryScreen";

const HistoryScreen = () => {
  return (
    <SafeAreaView className="h-screen bg-gray-50">
      <History />
    </SafeAreaView>
  );
};

export default HistoryScreen;
