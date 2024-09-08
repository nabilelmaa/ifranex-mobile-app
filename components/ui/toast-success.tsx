import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ToastSuccessProps {
  message: string;
}

export const ToastSuccess: React.FC<ToastSuccessProps> = ({ message }) => (
  <View style={styles.toastContainer}>
    <View style={styles.toastContent}>
      <Svg
        style={styles.icon}
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <Path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </Svg>
      <Text style={styles.message}>{message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    maxWidth: 300,
    backgroundColor: '#1F2937', // Equivalent to bg-zinc-800
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    padding: 10,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    color: '#10B981', // Equivalent to text-colGreen-000
  },
});
