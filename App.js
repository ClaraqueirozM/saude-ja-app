

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from './src/Screens/LoginScreen.js'; 
import TriageScreen from './src/Screens/TriageScreen.js';
import RegisterScreen from './src/Screens/RegisterScreen.js'; 
import RecommendationScreen from './src/Screens/RecommendationScreen.js';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const CURRENT_USER_KEY = '@current_user'; 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        
        const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY); 
        
        if (userJson) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Falha ao ler o status de login', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
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
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#005CA9' }, 
          headerTintColor: '#fff', 
          headerTitleStyle: { fontWeight: 'bold' }, 
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Triage"
              options={{ title: 'Guia de Atendimento' }}
            >
              {props => <TriageScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="Recommendation"
              component={RecommendationScreen}
              options={{ title: 'Recomendação' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              
              {props => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Cadastro' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5F1FB', 
  },
});
