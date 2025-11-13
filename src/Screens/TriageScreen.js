import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const sintomas = ['Febre', 'Tosse', 'Dor de garganta', 'Falta de ar', 'Cólica/Dor'];
const gravidades = ['Leve', 'Moderado', 'Grave'];

export default function TriageScreen({ navigation, onLogout }) {
    const [sintomaSelecionado, setSintomaSelecionado] = useState([]); 
    const [gravidadeSelecionada, setGravidadeSelecionada] = useState(null);
    const [userName, setUserName] = useState('Usuário'); 

     useEffect(() => {
        const fetchUserName = async () => {
            const name = await AsyncStorage.getItem('@current_user_name');
            if (name) {
                setUserName(name);
            }
        };
        fetchUserName();
      }, []);

      const handleSymptomPress = (symptom) => {
        setSintomaSelecionado((prevSintomas) => {
            if (prevSintomas.includes(symptom)) {
                return prevSintomas.filter(s => s !== symptom);
            } else {
                return [...prevSintomas, symptom];
            }
        });
    };

    const handleSeverityPress = (severity) => {
        setGravidadeSelecionada(severity);
    };

    const handleNextPress = () => {
        if (sintomaSelecionado.length > 0 && gravidadeSelecionada) {
            const sintomaString = sintomaSelecionado.join(', ');

            navigation.navigate('Recommendation', {
                sintoma: sintomaString,
                gravidade: gravidadeSelecionada,
            });
        } else {
            Alert.alert('Atenção', 'Por favor, selecione pelo menos um sintoma e uma gravidade.');
        }
    };
    
     const handleLogout = async () => {
         try {
            await AsyncStorage.removeItem('@current_user_id');
            await AsyncStorage.removeItem('@current_user_name');
             onLogout();
         } catch (error) {
            Alert.alert('Erro', 'Não foi possível desconectar.');
        }
    };

    return (
         <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>Olá, {userName}!</Text> 
             <Text style={styles.sectionTitle}>Triagem Rápida</Text>
            <View style={styles.buttonGrid}>
                {sintomas.map((symptom) => (
                    <TouchableOpacity
                        key={symptom}
                        style={[
                            styles.symptomButton,
                            sintomaSelecionado.includes(symptom) && styles.symptomButtonSelected,
                        ]}
                        onPress={() => handleSymptomPress(symptom)}
                    >
                        <Text style={styles.buttonText}>{symptom}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
            {sintomaSelecionado.length > 0 && gravidadeSelecionada && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
                    <Text style={styles.nextButtonText}>Ver Recomendação</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5F1FB',
        padding: 15,
     },
    welcomeText: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#005CA9', 
        marginBottom: 10 
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#005CA9',
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    symptomButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#005CA9',
        width: '48%', 
    },
    symptomButtonSelected: {
        backgroundColor: '#005CA9',
        borderColor: '#fff',
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
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#005CA9',
    },
    gravityButtonSelected: {
        backgroundColor: '#005CA9',
        borderColor: '#fff',
    },
    gravityButtonText: {
        color: '#000',
    },
    nextButton: {
        backgroundColor: '#005CA9',
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