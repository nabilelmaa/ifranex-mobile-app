import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangePasswordScreen from "../../screens/ChangePasswordScreen";

const ChangePassword = () => {
  return (
    <SafeAreaView className="h-screen">
      <ChangePasswordScreen />
    </SafeAreaView>
  );
};

export default ChangePassword;
