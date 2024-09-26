import { View, Image } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/index";
import CustomText from "./CustomText";

const Hero = () => {
  const [user, setUser] = useState<User | null>(null);
  const fetchUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const response = await fetch(
        "https://ifranex.vercel.app/api/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Status: ${response} `);
      } else {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching data.");
    }
  };
  useEffect(() => {
    fetchUser();
  }),
    [];
  return (
    <View className="p-2 flex-row items-center">
      {user?.profilePicture ? (
        <Image
          source={{
            uri: user?.profilePicture,
          }}
          className="w-12 h-12 rounded-full mr-2"
        />
      ) : (
        <View className="w-12 h-12 border-2 bg-slate-200 border-slate-400 rounded-full items-center justify-center mr-2">
          <CustomText className="text-2xl text-slate-900">
            {user?.username.charAt(0).toUpperCase()}
          </CustomText>
        </View>
      )}
      <View>
        <CustomText className="font-semibold text-3xl">
          Hi,{" "}
          {user?.username
            ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
            : ""}
        </CustomText>
        <CustomText className="font-semibold text-xl text-zinc-600">
          Welcome back
        </CustomText>
      </View>
    </View>
  );
};

export default Hero;
