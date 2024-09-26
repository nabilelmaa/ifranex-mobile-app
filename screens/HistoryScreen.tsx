import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomText from "@/components/CustomText";
import * as SecureStore from "expo-secure-store";
import { Booking } from "@/types/index";

interface ApiResponse {
  bookings: Booking[];
}

const HistoryScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");
      const response = await fetch(
        "https://ifranex.vercel.app/api/bookings/history",
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
      } else {
        const data: ApiResponse = await response.json();
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching booking history. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [fetchHistory]);

  const confirmCancel = async (bookingId: string) => {
    try {
      const response = await fetch(
        `https://ifranex.vercel.app/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Canceled" }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      await fetchHistory();
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setSelectedBookingId(null);
    }
  };

  const handleCancelPress = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => confirmCancel(bookingId),
        },
      ],
      { cancelable: false }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-200 text-green-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "canceled":
        return "bg-red-200 text-red-800";
      case "confirmed":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "check-circle";
      case "pending":
        return "clock";
      case "canceled":
        return "x-circle";
      case "confirmed":
        return "check";
      default:
        return "help-circle";
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <Animated.View
      style={{
        opacity: new Animated.Value(1),
        transform: [{ translateY: new Animated.Value(0) }],
      }}
      className="bg-white mb-4 rounded-lg shadow-md overflow-hidden"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <CustomText className="font-bold text-lg text-gray-800">
            {item.title}
          </CustomText>
          <View
            className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
          >
            <View className="flex-row items-center w-20">
              <Feather
                name={getStatusIcon(item.status)}
                size={14}
                className="ml-1"
              />
              <CustomText className="text-xs font-medium ml-1">
                {item.status}
              </CustomText>
            </View>
          </View>
        </View>
        <CustomText className="text-gray-600 mb-2">
          {new Date(item.bookingDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CustomText>
        <CustomText className="text-gray-700 mb-4">
          {item.description}
        </CustomText>

        {(item.status === "Pending" || item.status === "Confirmed") && (
          <TouchableOpacity
            className="bg-red-500 px-3 py-2 rounded-full"
            onPress={() => handleCancelPress(item.id)}
          >
            <CustomText className="text-white text-center">
              Cancel Booking
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <CustomText className="mt-4 text-gray-600">Loading...</CustomText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <CustomText className="mt-4 text-red-500 text-center">
          {error}
        </CustomText>
        <CustomText
          className="mt-2 text-indigo-600 font-medium"
          onPress={fetchHistory}
        >
          Try Again
        </CustomText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Feather name="calendar" size={48} color="#9CA3AF" />
            <CustomText className="mt-4 text-gray-500 text-center">
              No booking history found.
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default HistoryScreen;
