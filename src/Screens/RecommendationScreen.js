 import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';


const UPAS_RECIFE = [
    { nome: "UPA Caxangá", bairro: "Caxangá", telefone: "(81) 3355-6080" },
    { nome: "UPA Imbiribeira", bairro: "Imbiribeira", telefone: "(81) 3355-1681" },
    { nome: "UPA Nova Descoberta", bairro: "Nova Descoberta", telefone: "(81) 3355-4607" },
    { nome: "UPA Torrões", bairro: "Torrões", telefone: "(81) 3355-6184" },
    { nome: "UPA Ibura", bairro: "Ibura", telefone: "(81) 3355-2578" },
    { nome: "UPA Jardim Paulista", bairro: "Jardim Paulista", telefone: "(81) 3378-0000" }, 
];

export default function RecommendationScreen({ route, navigation }) {
    const { sintoma, gravidade } = route.params;

    
    const getRecommendationData = () => {
        if (gravidade === 'Grave' && sintoma === 'Falta de ar') {
            return {
                text: 'Emergência! Falta de ar grave é um ALERTA VERMELHO. Ligue imediatamente para o SAMU ou dirija-se ao PA mais próximo.',
                color: '#dc3545', 
                showUpas: true,
            };
        }
        if (gravidade === 'Grave') {
            return {
                text: `Risco Alto! Para o sintoma de ${sintoma}, procure urgentemente uma UPA ou UPAE.`,
                color: '#FFC107', 
                samu: false,
                showUpas: true,
            };
        }
        if (gravidade === 'Moderado' && (sintoma === 'Febre' || sintoma === 'Tosse')) {
            return {
                text: 'Recomendamos monitoramento contínuo. Procure uma UBS ou UPA se a condição piorar ou persistir.',
                color: '#007bff', 
                samu: false,
                showUpas: true,
            };
        }
        
        
        return {
            text: `Para o sintoma "${sintoma}" com gravidade "${gravidade}", o protocolo é repouso, hidratação e avaliar se há necessidade de atendimento em 24h.`,
            color: '#35C77F',
            samu: false,
            showUpas: false, 
        };
    };

    const recommendation = getRecommendationData();
    
    
    const callNumber = (phone) => {
        const phoneNumber = phone.replace(/[^\d]/g, ''); 
        Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={require('../assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.title}>Recomendação</Text>
            
            <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>Você selecionou:</Text>
                <Text style={styles.detailText}>Sintoma: {sintoma}</Text>
                <Text style={styles.detailText}>Gravidade: {gravidade}</Text>
            </View>
            
            <View style={[styles.recommendationBox, {borderColor: recommendation.color}]}>
                <Text style={styles.recommendationTitle}>Nosso Guia Sugere:</Text>
                <Text style={[styles.recommendationText, {color: recommendation.color === '#dc3545' ? '#dc3545' : '#000'}]}>
                    {recommendation.text}
                </Text>
            </View>

            
            {recommendation.samu && (
                <View style={[styles.emergencyBox, { borderColor: recommendation.color }]}>
                    <Text style={styles.emergencyTitle}>LIGAR IMEDIATAMENTE:</Text>
                    <TouchableOpacity onPress={() => callNumber('192')}>
                        <Text style={styles.samuText}>📞 SAMU: 192</Text>
                    </TouchableOpacity>
                </View>
            )}

            
            {recommendation.showUpas && (
                <View style={styles.upasSection}>
                    <Text style={styles.upasTitle}>UPAs de Referência em Recife:</Text>
                    {UPAS_RECIFE.map((upa, index) => (
                        <View key={index} style={styles.upaItem}>
                            <Text style={styles.upaName}>{upa.nome} ({upa.bairro})</Text>
                            <TouchableOpacity onPress={() => callNumber(upa.telefone)}>
                                <Text style={styles.upaPhone}>📞 {upa.telefone}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Text style={styles.infoText}>*Telefones para contato com a unidade.</Text>
                </View>
            )}
            
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Voltar para Triagem</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5F1FB',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#005CA9',
        textAlign: 'center',
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
        fontWeight: 'bold',
    },
    recommendationBox: {
        backgroundColor: '#f0f8ff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2, 
        borderColor: '#b3e0ff',
        marginBottom: 20,
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
    
    emergencyBox: {
        backgroundColor: '#fee',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 2,
    },
    emergencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#dc3545'
    },
    samuText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#dc3545',
        textDecorationLine: 'underline',
    },
    upasSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    upasTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#005CA9'
    },
    upaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    upaName: {
        fontSize: 15,
        fontWeight: '600',
        flexShrink: 1, 
    },
    upaPhone: {
        fontSize: 15,
        color: '#005CA9',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
        fontStyle: 'italic'
    },
    backButton: {
        backgroundColor: '#005CA9',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center'
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});