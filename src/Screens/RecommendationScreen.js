

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function RecommendationScreen({ route }) {
  const { sintoma, gravidade } = route.params;

  const getRecommendation = () => {
    // ...
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Recomendação</Text>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Você selecionou:</Text>
        <Text style={styles.detailText}>Sintoma: {sintoma}</Text>
        <Text style={styles.detailText}>Gravidade: {gravidade}</Text>
      </View>
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>Nosso Guia Sugere:</Text>
        <Text style={styles.recommendationText}>{getRecommendation()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F1FB',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#005CA9',
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
   recommendationBox: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3e0ff',
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0056b3',
  },
  recommendationText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 25,
  },
});