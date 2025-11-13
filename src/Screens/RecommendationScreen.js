import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, TouchableOpacity, Alert, Platform } from 'react-native'; 

const UPAS_RECIFE = [
    { nome: "UPA Caxangá", bairro: "Iputinga", telefone: "(81) 3184-4355", 
      latitude: -8.02978, longitude: -34.95762 }, 
    { nome: "UPA Imbiribeira", bairro: "Imbiribeira", telefone: "(81) 3184-4328", 
      latitude: -8.12069, longitude: -34.91388 },
    { nome: "UPA Nova Descoberta", bairro: "Nova Descoberta", telefone: "(81)3184-4581", 
      latitude: -8.00215, longitude: -34.91993 }, 
    { nome: "UPA Torrões", bairro: "Torrões", telefone: "(81) 3184-4444", 
      latitude: -8.06332, longitude: -34.93419 },
    { nome: "UPA Ibura", bairro: "Cohab/Ibura", telefone: "(81) 3184-4616", 
      latitude: -8.12891, longitude: -34.94965 }, 
];

const CLINICAS_ESPECIALIZADAS = [
    { nome: "Hospital da Restauração (HR)", especialidade: "Trauma / Queimados", telefone: "(81) 3181-5400", 
      latitude: -8.05366, longitude: -34.89752 },
    { nome: "PROCAPE (Cardiologia)", especialidade: "Cardiologia", telefone: "(81) 3181-7100", 
      latitude: -8.04922, longitude: -34.88766 }, 
    { nome: "Hospital Barão de Lucena", especialidade: "Clínica Geral / Pediatria", telefone: "(81) 3184-6400", 
      latitude: -8.039987, longitude: -34.93943},
    { nome: "UPAE Arruda", especialidade: "Múltiplas Especialidades Clínicas", telefone: "(81) 2011-0200", 
      latitude: -8.02798, longitude: -34.89161 }, 
];


export default function RecommendationScreen({ route, navigation }) {
    const { sintoma = 'Nenhum', gravidade = 'Nenhuma' } = route.params || {};

    const getRecommendationData = () => {
        
        const alertaVermelho = ['Falta de ar', 'Dor no Peito', 'Trauma', 'Alteração de Consciência', 'Sangramento Incontrolável'];

        if (gravidade === 'Grave' && alertaVermelho.some(keyword => sintoma.includes(keyword))) {
            return {
                text: 'Emergência! Este é um ALERTA VERMELHO. Ligue imediatamente para o SAMU (192) ou dirija-se ao PA/Hospital mais próximo.',
                color: '#dc3545', 
                showUpas: true,
                samu: true,
                showClinicas: true,
            };
        }
        
        if (gravidade === 'Grave') {
            return {
                text: `Risco Alto! Para o sintoma de ${sintoma}, procure urgentemente uma UPA ou UPAE.`,
                color: '#FFC107', 
                samu: false,
                showUpas: true,
                showClinicas: true, 
            };
        }
        
        if (gravidade === 'Moderado' && (sintoma.includes('Febre') || sintoma.includes('Tosse'))) {
            return {
                text: 'Recomendamos monitoramento contínuo. Procure uma UPA se a condição piorar ou persistir (tempo ideal: 24h).',
                color: '#007bff', 
                samu: false,
                showUpas: true, 
                showClinicas: false,
            };
         }
        
         return {
            text: `Para o sintoma "${sintoma}" com gravidade "${gravidade}", o protocolo é repouso, hidratação e avaliar se há necessidade de atendimento em 24h.`,
            color: '#35C77F',
            samu: false,
            showUpas: false, 
            showClinicas: false,
        };
    };

    const recommendation = getRecommendationData();
    
    
    const callNumber = (phone) => {
        const phoneNumber = phone.replace(/[^\d]/g, ''); 
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const openMap = (latitude, longitude, name) => {
        const label = encodeURIComponent(name);
        
        const geoUrl = Platform.select({
            ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${label}`
        });

        Linking.openURL(geoUrl).catch(() => {
            Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
        });
    };

    const renderUnitItem = (unit, isUpa = true) => (
        <View key={unit.nome} style={styles.upaItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.upaName}>
                    {unit.nome} ({isUpa ? unit.bairro : unit.especialidade})
                </Text>
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => openMap(unit.latitude, unit.longitude, unit.nome)}>
                    <Text style={[styles.upaPhone, {marginRight: 15, fontSize: 18}]}>📍</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => callNumber(unit.telefone)}>
                    <Text style={styles.upaPhone}>📞</Text>
                </TouchableOpacity>
            </View>
        </View>
    );


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
                    {UPAS_RECIFE.map(upa => renderUnitItem(upa, true))}
                    <Text style={styles.infoText}>*Toque no 📞 para ligar ou no 📍 para abrir o mapa.</Text>
                </View>
            )}

            
            {recommendation.showClinicas && CLINICAS_ESPECIALIZADAS.length > 0 && (
                <View style={styles.upasSection}> 
                    <Text style={styles.upasTitle}>Hospitais de Referência (UPAEs/Hospitais):</Text>
                    {CLINICAS_ESPECIALIZADAS.map(clinica => renderUnitItem(clinica, false))}
                    <Text style={styles.infoText}>*Hospitais de referência para casos graves específicos.</Text>
                </View>
            )}
            
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.navigate('Triage'); 
                    }
                }}
            >
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
        borderBottomColor: '#eee',
        alignItems: 'center', 
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