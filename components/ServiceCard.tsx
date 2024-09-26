import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    pricePerHour: number;
    banner: string;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: service.banner }}
        style={styles.image}
        resizeMode="cover"
      />
      <CustomText style={styles.title}>{service.title}</CustomText>
      <CustomText style={styles.description} numberOfLines={3}>
        {service.description}
      </CustomText>
      <CustomText style={styles.price}>
        MAD <CustomText style={styles.priceValue}>{service.pricePerHour}</CustomText>/hour
      </CustomText>

      <TouchableOpacity style={styles.button}>
        <CustomText style={styles.buttonText}>Book Now</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 2,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    width: "100%",
    height: 320, 
    justifyContent: "space-between", 
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
    flexShrink: 1,
  },
  price: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4338ca", 
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ServiceCard;
