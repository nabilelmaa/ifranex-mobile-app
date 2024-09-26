import React from "react";
import { View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CustomText from "./CustomText";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    user: {
      profilePicture: string;
      username: string;
    };
  };
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= rating ? "star" : "star-o"}
        size={16}
        color={i <= rating ? "#FFD700" : "#C0C0C0"}
      />
    );
  }
  return stars;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { profilePicture, username } = review.user;
  const avatar = profilePicture ? (
    <Image
      source={{ uri: profilePicture }}
      style={{ width: 40, height: 40, borderRadius: 20 }}
      resizeMode="cover"
    />
  ) : (
    <View style={{ width: 40, height: 40, backgroundColor: '#D1D5DB', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
      <CustomText style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
        {username.charAt(0).toUpperCase()}
      </CustomText>
    </View>
  );

  return (
    <View style={{ backgroundColor: 'white', padding: 16, marginBottom: 1, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, height: 180 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {avatar}
        <CustomText style={{ fontWeight: 'bold', marginLeft: 16 }}>{username}</CustomText>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 8 }}>{renderStars(review.rating)}</View>

      <View style={{ flex: 1 }}>
        <CustomText numberOfLines={3} ellipsizeMode="tail" style={{ color: '#4B5563' }}>
          {review.comment}
        </CustomText>
      </View>
    </View>
  );
};

export default ReviewCard;