import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CryptoJS from 'crypto-js'; 
import { buscarUsuarioPorEmail, initializeDatabase } from '../services/dataservice'; 

export default function LoginScreen({ onLogin, navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const initDB = async () => {
            try {
                await initializeDatabase();
            } catch (error) {
                console.error("Erro na inicialização do DB:", error);
            }
        };
        initDB();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Aviso', 'Por favor, preencha o email e a senha.');
            return;
        }

        try {
            const foundUser = await buscarUsuarioPorEmail(email);

            if (!foundUser) {
                Alert.alert('Erro no Login', 'Email ou senha incorretos. Verifique e tente novamente.');
                return;
            }

            const passwordHashDigitada = CryptoJS.SHA256(password).toString();

            if (passwordHashDigitada === foundUser.senha_hash) {
                await AsyncStorage.setItem('@current_user_id', foundUser.id.toString());
                await AsyncStorage.setItem('@current_user_name', foundUser.nome); 

                Alert.alert('Sucesso!', `Login bem-sucedido. Bem-vindo(a), ${foundUser.nome}.`);
                
                onLogin(); 
            } else {
                Alert.alert('Erro no Login', 'Email ou senha incorretos. Verifique e tente novamente.');
            }
        } catch (error) {
            console.error('Erro no Login (SQLite):', error);
            Alert.alert('Erro Interno', `Falha ao tentar logar: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/logo.jpg')} 
                style={styles.logo} 
                resizeMode="contain" 
            />
            
            <Text style={styles.appName}>Saúde Já</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#666"
            />
            
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#666"
                />
                <TouchableOpacity 
                    style={styles.toggleButton} 
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.toggleText}>
                        {showPassword ? '👁️' : '🔒'} 
                    </Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5F1FB', 
        padding: 20,
    },
    logo: {
        width: 250,
        height: 80,
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#005CA9', 
        marginBottom: 40, 
        textAlign: 'center',
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    toggleButton: {
        height: 50,
        width: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0, 
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 20,
    },
    
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#005CA9', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    forgotPasswordText: {
        color: '#005CA9',
        marginTop: 10,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    registerText: {
        color: '#005CA9',
        marginTop: 20,
        fontSize: 16,
        fontWeight: '500',
    },
});