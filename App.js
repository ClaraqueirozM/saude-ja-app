 import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, View, ActivityIndicator, StyleSheet, Text } from 'react-native';


import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import TriageScreen from './src/Screens/TriageScreen';
import RecommendationScreen from './src/Screens/RecommendationScreen';


import { initializeDatabase } from './src/services/dataservice';

const Stack = createNativeStackNavigator();


function AppStack({ onLogout }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#005CA9' }, headerTintColor: '#fff' }}>
            <Stack.Screen 
                name="Triage" 
                options={{ title: 'Triagem Rápida' }}
            >
                {(props) => <TriageScreen {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen 
                name="Recommendation" 
                component={RecommendationScreen} 
                options={{ title: 'Recomendação de Saúde' }}
            />
        </Stack.Navigator>
    );
}


function AuthStack({ onLogin }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen 
                name="Login" 
            >
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen 
                name="Register" 
                component={RegisterScreen} 
            />
        </Stack.Navigator>
    );
}


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const setupApp = async () => {
            try {
                
                await initializeDatabase();
                
                const userId = await AsyncStorage.getItem('@current_user_id');
                
                if (userId) {
                    setIsLoggedIn(true); 
                }
            } catch (e) {
                console.error("Erro na Inicialização do App:", e);
                Alert.alert("Erro Crítico", "Não foi possível carregar o banco de dados. Verifique a instalação do expo-sqlite.");
            } finally {
                setIsLoading(false);
            }
        };

        setupApp();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005CA9" />
                <Text style={{marginTop: 10, color: '#005CA9'}}>Carregando Saúde Já...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <AppStack onLogout={handleLogout} />
            ) : (
                <AuthStack onLogin={handleLogin} />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5F1FB'
    }
 });