import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../../screens/ProfileScreen";

const ProfileScreen = () => {
  return (
    <SafeAreaView className="h-screen bg-cyan-400">
      <Profile />
    </SafeAreaView>
  );
};

export default ProfileScreen;
