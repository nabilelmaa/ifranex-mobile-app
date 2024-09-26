import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import CustomText from "@/components/CustomText";
import { Message } from "@/types/index";

interface ApiResponse {
  messages: Message[];
}

const InboxScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");
      const response = await fetch(
        "https://ifranex.vercel.app/api/bookings/messages",
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
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching messages. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages();
  }, [fetchMessages]);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <CustomText style={styles.serviceTitle}>{item.serviceTitle}</CustomText>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.bookingStatus) },
            ]}
          />
          <CustomText style={styles.statusText}>
            {item.bookingStatus}
          </CustomText>
        </View>
      </View>
      <CustomText style={styles.messageContent} numberOfLines={2}>
        {item.content}
      </CustomText>
      <View style={styles.messageFooter}>
        <CustomText style={styles.dateText}>
          {formatDate(item.createdAt)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <CustomText style={styles.loadingText}>Loading...</CustomText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <CustomText style={styles.errorText}>{error}</CustomText>
        <TouchableOpacity onPress={fetchMessages} style={styles.retryButton}>
          <CustomText style={styles.retryText}>Try Again</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Feather name="inbox" size={48} color="#9CA3AF" />
        <CustomText style={styles.emptyText}>No messages found.</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "#34D399";
    case "confirmed":
      return "#2563eb";
    case "canceled":
      return "#ef4444";
    default:
      return "#9CA3AF";
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    padding: 16,
  },
  messageItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6B7280",
  },
  messageContent: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default InboxScreen;
