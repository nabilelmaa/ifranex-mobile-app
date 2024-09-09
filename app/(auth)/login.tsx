import LoginForm from "../../components/forms/LoginForm";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <SafeAreaView className="h-screen bg-white">
      <LoginForm />
    </SafeAreaView>
  );
};

export default Login;
