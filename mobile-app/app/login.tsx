import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as storage from '../lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import { theme } from '../constants/theme';
import Logo from '../components/Logo';
import AppBackground from '../components/ui/AppBackground';

export default function LoginScreen() {
    const router = useRouter();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Check for existing session on mount — if user is already logged in, skip to tabs
    useEffect(() => {
        const checkSession = async () => {
            const token = await storage.getItem('userToken');
            if (token) {
                router.replace('/(tabs)');
            }
        };
        checkSession();
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/student/login', {
                emailOrPhone: email,
                password
            });

            if (res.data.success) {
                const { accessToken, refreshToken, user } = res.data.data;

                // Save authentication tokens
                await storage.setItem('userToken', accessToken);
                if (refreshToken) await storage.setItem('refreshToken', refreshToken);

                // Save full user data
                await storage.setItem('userData', JSON.stringify(user));

                // Save the admin-assigned branch from login response.
                // This ensures the app always shows the correct branch regardless
                // of what was tapped on the branch-selection screen.
                if (user?.branch) {
                    await AsyncStorage.setItem('selectedBranchId', user.branch.id || user.branchId || '');
                    await AsyncStorage.setItem('selectedBranchName', user.branch.name || '');
                } else if (user?.branchId) {
                    await AsyncStorage.setItem('selectedBranchId', user.branchId);
                    await AsyncStorage.setItem('selectedBranchName', '');
                }

                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppBackground style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Main Container: Dark, semi-transparent, rounded */}
                    <View style={styles.mainContainer}>

                        {/* Logo with 20% opacity glow */}
                        <View style={styles.logoWrapper}>
                            <Logo size={100} textVisible={false} />
                        </View>

                        {/* Heading */}
                        <Text style={styles.welcomeText}>Welcome to NSM</Text>

                        {/* ─────────────────────────────────────────────────
                         *  REGISTER TAB — COMMENTED OUT (will be re-enabled
                         *  once the admin-register flow is deprecated)
                         * ─────────────────────────────────────────────────
                         *
                         * <View style={styles.tabContainer}>
                         *     <TouchableOpacity style={[styles.tab, styles.activeTab]} activeOpacity={0.8}>
                         *         <Text style={styles.activeTabText}>Login</Text>
                         *     </TouchableOpacity>
                         *     <TouchableOpacity style={[styles.tab]} activeOpacity={0.8}>
                         *         <Text style={styles.inactiveTabText}>Register</Text>
                         *     </TouchableOpacity>
                         * </View>
                         *
                         * ───────────────────────────────────────────────── */}

                        {/* Form Fields — Login Only */}
                        <View style={styles.formContainer}>

                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Ionicons name="mail-outline" size={20} color="#0bf6f6" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="#a0aab2"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Ionicons name="lock-closed-outline" size={20} color="#0bf6f6" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#a0aab2"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Primary Action Button */}
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                                activeOpacity={0.9}
                                disabled={isLoading}
                            >
                                <Text style={styles.loginButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
                            </TouchableOpacity>

                            {/* Info note for students */}
                            <Text style={styles.infoNote}>
                                Your login credentials are sent to your registered email address by the academy.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    mainContainer: {
        backgroundColor: 'rgba(0, 15, 31, 0.05)',
        borderRadius: 32,
        paddingHorizontal: 20,
        paddingVertical: 32,
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.1)',
    },
    logoWrapper: {
        marginBottom: 16,
        borderRadius: 60,
        backgroundColor: '#00152b',
        shadowColor: '#0bf6f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 20,
    },
    welcomeText: {
        color: '#ffffff',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 26,
        marginBottom: 24,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 58, 72, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 60,
        width: '100%',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#a0aab2',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },
    forgotPasswordText: {
        color: '#a0aab2',
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: 4,
    },
    loginButton: {
        backgroundColor: '#0bf6f6',
        borderRadius: 10,
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0bf6f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 20,
        marginTop: 8,
    },
    loginButtonText: {
        color: '#000000',
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
    },
    infoNote: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#a0aab2',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 18,
        paddingHorizontal: 10,
    },
});
