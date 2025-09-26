

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecommendationScreen({ route }) {
  const { sintoma, gravidade } = route.params;

  const getRecommendation = () => {
    if (gravidade === 'Grave' || sintoma === 'Falta de ar' || sintoma === 'Dor no peito') {
      return 'Procure um hospital ou UPA imediatamente!';
    }
    if (gravidade === 'Moderado') {
      return 'Procure uma unidade de saúde de pronto atendimento.';
    }
    return 'Repouso e medicação. Se os sintomas piorarem, procure uma unidade de saúde.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recomendação</Text>
      <Text style={styles.summaryText}>
        Você selecionou:
      </Text>
      <Text style={styles.detailText}>Sintoma: {sintoma}</Text>
      <Text style={styles.detailText}>Gravidade: {gravidade}</Text>
      
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>Nosso Guia Sugere:</Text>
        <Text style={styles.recommendationText}>
          {getRecommendation()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f0f8ff',
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