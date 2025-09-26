

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const sintomas = ['Febre', 'Tosse', 'Dor de garganta', 'Falta de ar', 'Cólica/Dor'];
const gravidades = ['Leve', 'Moderado', 'Grave'];

export default function TriageScreen({ navigation, onLogout }) {
  const [sintomaSelecionado, setSintomaSelecionado] = useState(null);
  const [gravidadeSelecionada, setGravidadeSelecionada] = useState(null);

  const handleSymptomPress = (symptom) => {
    setSintomaSelecionado(symptom);
  };

  const handleSeverityPress = (severity) => {
    setGravidadeSelecionada(severity);
  };

  const handleNextPress = () => {
    if (sintomaSelecionado && gravidadeSelecionada) {
      navigation.navigate('Recommendation', {
        sintoma: sintomaSelecionado,
        gravidade: gravidadeSelecionada,
      });
    } else {
      Alert.alert('Atenção', 'Por favor, selecione um sintoma e uma gravidade.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de Sintomas */}
      <Text style={styles.sectionTitle}>Triagem Rápida</Text>
      <View style={styles.buttonGrid}>
        {sintomas.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[
              styles.symptomButton,
              sintomaSelecionado === symptom && styles.symptomButtonSelected,
            ]}
            onPress={() => handleSymptomPress(symptom)}
          >
            <Text style={styles.buttonText}>{symptom}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seção de Gravidade */}
      <Text style={styles.sectionTitle}>Como está a gravidade?</Text>
      <View style={styles.gravityButtons}>
        {gravidades.map((severity) => (
          <TouchableOpacity
            key={severity}
            style={[
              styles.gravityButton,
              gravidadeSelecionada === severity && styles.gravityButtonSelected,
            ]}
            onPress={() => handleSeverityPress(severity)}
          >
            <Text style={styles.gravityButtonText}>{severity}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de "Ver Recomendação" */}
      {sintomaSelecionado && gravidadeSelecionada && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>Ver Recomendação</Text>
        </TouchableOpacity>
      )}

      {/* Botão de "Sair" */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  symptomButtonSelected: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#000',
  },
  gravityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  gravityButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  gravityButtonSelected: {
    backgroundColor: '#007bff',
  },
  gravityButtonText: {
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});