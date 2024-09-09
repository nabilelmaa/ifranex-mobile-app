import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import RegisterForm from "../../components/forms/RegisterForm";

const Register = () => {
  return (
    <SafeAreaView className="h-screen bg-white">
      <RegisterForm />
    </SafeAreaView>
  );
};

export default Register;
