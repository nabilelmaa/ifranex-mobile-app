import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Inbox from "../../../screens/InboxScreen";

const InboxScreen = () => {
  return (
    <SafeAreaView className="h-screen bg-lime-500">
      <Inbox />
    </SafeAreaView>
  );
};

export default InboxScreen;
