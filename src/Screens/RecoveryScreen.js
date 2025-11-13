import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CryptoJS from 'crypto-js';
import { buscarUsuarioPorEmail, atualizarSenha } from '../services/dataservice'; 

export default function RecoveryScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    const handleVerifyUser = async () => {
        if (!email || !name) {
            Alert.alert('Aviso', 'Por favor, preencha todos os campos.');
            return;
        }

        const foundUser = await buscarUsuarioPorEmail(email);

        if (foundUser && foundUser.nome.toLowerCase().trim() === name.toLowerCase().trim()) {
            Alert.alert('Sucesso', 'Usuário verificado. Agora defina sua nova senha.');
            setStep(2);
        } else {
            Alert.alert('Erro', 'Nome ou E-mail não correspondem.');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            Alert.alert('Aviso', 'Por favor, preencha a nova senha e a confirmação.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Erro', 'As novas senhas não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        const newSenhaHash = CryptoJS.SHA256(newPassword).toString();
        
        try {
            await atualizarSenha(email, newSenhaHash);
            Alert.alert('Sucesso!', 'Senha alterada com sucesso. Faça login com a nova senha.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao atualizar a senha. Tente novamente.');
        }
    };
    
    const renderStep1 = () => (
        <>
            <TextInput
                style={styles.input}
                placeholder="Seu E-mail de Cadastro"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Seu Nome Completo"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyUser}>
                <Text style={styles.buttonText}>Verificar Usuário</Text>
            </TouchableOpacity>
        </>
    );

    const renderStep2 = () => (
        <>
            <View style={styles.passwordContainer}> 
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Nova Senha (mín. 6 caracteres)"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#888" 
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
                    placeholder="Confirmar Nova Senha"
                    secureTextEntry={!showPassword}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholderTextColor="#888" 
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

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Redefinir Senha</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {step === 1 ? 'Verificação de Identidade' : 'Definir Nova Senha'}
            </Text>

            {step === 1 ? renderStep1() : renderStep2()}

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.backButtonText}>Voltar ao Login</Text>
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
        fontSize: 24,
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
        marginTop: 30,
    },
    backButtonText: {
        color: '#005CA9',
        fontSize: 16,
        textDecorationLine: 'underline',
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
});