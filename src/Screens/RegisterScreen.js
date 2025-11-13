import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CryptoJS from 'crypto-js'; 
import { cadastrarUsuario } from '../services/dataservice'; 

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        const senhaHash = CryptoJS.SHA256(password).toString();

        try {
            await cadastrarUsuario(email, senhaHash, name);
            
            Alert.alert('Sucesso!', 'Cadastro realizado com sucesso! Agora faça o login.');
            
            navigation.navigate('Login');

        } catch (error) {
            console.error('Erro ao registrar:', error);
            Alert.alert('Erro no Cadastro', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#888" 
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            
            <View style={styles.passwordContainer}> 
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Senha (mín. 6 caracteres)"
                    placeholderTextColor="#888" 
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
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
            
            <View style={styles.passwordContainer}> 
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmar Senha"
                    placeholderTextColor="#888" 
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
            
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.backButtonText}>Já tenho conta? Voltar ao Login</Text>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#005CA9',
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
        color: '#333', 
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
        color: '#333',
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
    },
    backButton: {
        marginTop: 20,
    },
    backButtonText: {
        color: '#005CA9',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});