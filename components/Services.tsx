import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import Reviews from "./Reviews";
import Hero from "./Hero";
import CustomText from "./CustomText";
import SearchBar from "./SearchBar";
import { Service } from "@/types/index";


const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://ifranex.vercel.app/api/services"
        );
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
      <View>
        <Hero />
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
    </ScrollView>
  );
};

export default Services;
