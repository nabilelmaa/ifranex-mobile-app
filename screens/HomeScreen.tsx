import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView, Image } from "react-native";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import ReviewCard from "../components/ReviewCard";
import Reviews from "../components/Reviews";
import CustomText from "../components/CustomText";
import SearchBar from "../components/SearchBar";
import { Service, User, Review } from "@/types/index";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUserData = async () => {
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
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  const fetchServices = async () => {
    const response = await axios.get("https://ifranex.vercel.app/api/services");
    return response.data;
  };

  const fetchReviews = async () => {
    const response = await axios.get("https://ifranex.vercel.app/api/reviews");
    return response.data.reviews;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        router.replace("/home");
      }
      try {
        const [userData, servicesData, reviewsData] = await Promise.all([
          fetchUserData(),
          fetchServices(),
          fetchReviews(),
        ]);
        setUser(userData);
        setServices(servicesData);
        setFilteredServices(servicesData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = services.filter(
      (service) =>
        service.title.toLowerCase().includes(lowercaseQuery) ||
        service.category.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredServices(filtered);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <CustomText className="mt-4 text-gray-600">Loading...</CustomText>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
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
      <View className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </View>
      <View>
        <CustomText className="font p-2 font-bold text-2xl">
          Browse our popular services
        </CustomText>
      </View>
      <View className="flex flex-wrap flex-row justify-between">
        {filteredServices.map((service) => (
          <View key={service.id} className="w-1/2 p-1">
            <ServiceCard service={service} />
          </View>
        ))}
      </View>
      <View>
        <View>
          <CustomText className="font p-2 font-bold text-2xl">
            What people say about us?
          </CustomText>
        </View>
        <Reviews />
      </View>
      <View className="flex flex-wrap flex-row justify-between">
        {reviews.slice(0, 4).map((review) => (
          <View key={review.id} className="w-1/2 p-1">
            <ReviewCard review={review} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
