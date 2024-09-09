import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import History from "../../../screens/HistoryScreen";

const HistoryScreen = () => {
  return (
    <SafeAreaView className="h-screen bg-red-500">
      <History />
    </SafeAreaView>
  );
};

export default HistoryScreen;
