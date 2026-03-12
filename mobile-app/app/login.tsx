import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Logo from '../components/Logo';

export default function LoginScreen() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const router = useRouter();

    const handleAuth = () => {
        // Mock authentication: anywhere goes to branch selection
        if (activeTab === 'register' && !acceptPrivacy) {
            alert("Please accept the Privacy Policy to continue.");
            return;
        }
        router.replace('/branch-selection');
    };

    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Top Wave Decoration */}
                <View style={styles.topWaveContainer}>
                    <View style={styles.waveLayer1} />
                    <View style={styles.waveLayer2} />
                </View>

                <View style={styles.headerContainer}>
                    <Logo size={80} textVisible={false} />
                    <Text style={styles.welcomeText}>Welcome to NSM</Text>
                </View>

                <View style={styles.card}>
                    {/* Tab Switcher */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                            onPress={() => setActiveTab('login')}
                        >
                            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                            onPress={() => setActiveTab('register')}
                        >
                            <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <View style={styles.formContainer}>
                        {activeTab === 'register' && (
                            <View style={styles.inputGroup}>
                                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor={colors.textSecondary} />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            {activeTab === 'login' ? (
                                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            ) : (
                                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            )}
                            {activeTab === 'login' && <Text style={styles.prefix}>+971</Text>}
                            <TextInput
                                placeholder={activeTab === 'login' ? 'Phone Number' : 'Email Address'}
                                style={styles.input}
                                keyboardType={activeTab === 'login' ? 'phone-pad' : 'email-address'}
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        {activeTab === 'register' && (
                            <View style={styles.inputGroup}>
                                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <Text style={styles.prefix}>+971</Text>
                                <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" placeholderTextColor={colors.textSecondary} />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor={colors.textSecondary} />
                        </View>

                        {activeTab === 'register' && (
                            <View style={styles.inputGroup}>
                                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry placeholderTextColor={colors.textSecondary} />
                            </View>
                        )}

                        {activeTab === 'register' && (
                            <TouchableOpacity 
                                style={styles.checkboxContainer} 
                                onPress={() => setAcceptPrivacy(!acceptPrivacy)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, acceptPrivacy && styles.checkboxChecked]}>
                                    {acceptPrivacy && <Ionicons name="checkmark" size={14} color={colors.card} />}
                                </View>
                                <Text style={styles.checkboxLabel}>
                                    I agree to the <Text style={styles.privacyLink}>Privacy Policy</Text>
                                </Text>
                            </TouchableOpacity>
                        )}

                        {activeTab === 'login' && (
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.actionButton} onPress={handleAuth}>
                            <Text style={styles.actionButtonText}>
                                {activeTab === 'login' ? 'Login' : 'Register'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    topWaveContainer: {
        height: 150,
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
    },
    waveLayer1: {
        position: 'absolute',
        top: -100,
        left: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(79, 195, 247, 0.4)', // Light water blue
    },
    waveLayer2: {
        position: 'absolute',
        top: -150,
        right: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(2, 136, 209, 0.2)', // Deep pool blue
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontFamily: 'Nunito_800ExtraBold',
        color: colors.textPrimary,
        marginTop: 15,
    },
    card: {
        backgroundColor: colors.card,
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 20,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontFamily: 'Poppins_500Medium',
        color: colors.textSecondary,
        fontSize: 14,
    },
    activeTabText: {
        color: colors.primaryDark,
        fontFamily: 'Poppins_600SemiBold',
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(79, 195, 247, 0.2)',
    },
    inputIcon: {
        marginRight: 10,
    },
    prefix: {
        fontFamily: 'Poppins_500Medium',
        color: colors.textPrimary,
        marginRight: 8,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        paddingRight: 8,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        color: colors.textPrimary,
        fontSize: 15,
    },
    forgotPassword: {
        textAlign: 'right',
        color: colors.primaryDark,
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
    },
    actionButton: {
        backgroundColor: colors.primaryDark,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        color: colors.card,
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: colors.primaryDark,
    },
    checkboxLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textPrimary,
    },
    privacyLink: {
        color: colors.primaryDark,
        fontFamily: 'Poppins_600SemiBold',
    },
});
