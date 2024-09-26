import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";
import ReviewCard from "./ReviewCard";

interface User {
  id: string;
  profilePicture: string;
  username: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  timestamp: string;
  user: User;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://ifranex.vercel.app/api/reviews");
   
        setReviews(response.data.reviews); 
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-1">
      <View className="flex flex-wrap flex-row justify-between">
        {reviews.slice(0,4).map((review) => (
          <View key={review.id} className="w-1/2 p-1">
            <ReviewCard review={review} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Reviews;
