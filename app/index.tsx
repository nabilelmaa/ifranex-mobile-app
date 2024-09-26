import React, { useEffect } from "react";
import Welcome from "./(auth)/welcome";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        router.replace("/home");
      }
    };

    checkToken();
  }, [router]);

  return <Welcome />;
};

export default Home;
