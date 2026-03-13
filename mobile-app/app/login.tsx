import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import Logo from '../components/Logo';
import AppBackground from '../components/ui/AppBackground';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import AppInput from '../components/ui/AppInput';

export default function LoginScreen() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const router = useRouter();

    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const handleAuth = () => {
        // Mock authentication: anywhere goes to branch selection
        if (activeTab === 'register' && !acceptPrivacy) {
            alert("Please accept the Privacy Policy to continue.");
            return;
        }
        router.replace('/branch-selection');
    };

    return (
        <AppBackground>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.headerContainer}>
                        <Logo size={100} textVisible={false} />
                        <Text style={styles.welcomeText}>Welcome to NSM</Text>
                    </View>

                    <GlassCard style={styles.cardContainer} hasGlow>
                        {/* Tab Switcher */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                                onPress={() => setActiveTab('login')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                                onPress={() => setActiveTab('register')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Content */}
                        <View style={styles.formContainer}>
                            {activeTab === 'register' && (
                                <AppInput 
                                    icon="person-outline" 
                                    placeholder="Full Name" 
                                />
                            )}

                            {activeTab === 'login' && (
                                <View style={styles.phoneInputGroup}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
                                    </View>
                                    <Text style={styles.prefix}>+971</Text>
                                    <TextInput
                                        placeholder="Phone Number"
                                        style={styles.phoneTextInput}
                                        keyboardType="phone-pad"
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>
                            )}

                            {activeTab === 'register' && (
                                <AppInput 
                                    icon="mail-outline" 
                                    placeholder="Email Address" 
                                    keyboardType="email-address"
                                />
                            )}

                            {activeTab === 'register' && (
                                <View style={styles.phoneInputGroup}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
                                    </View>
                                    <Text style={styles.prefix}>+971</Text>
                                    <TextInput
                                        placeholder="Phone Number"
                                        style={styles.phoneTextInput}
                                        keyboardType="phone-pad"
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>
                            )}

                            <AppInput 
                                icon="lock-closed-outline" 
                                placeholder="Password" 
                                secureTextEntry
                            />

                            {activeTab === 'register' && (
                                <AppInput 
                                    icon="lock-closed-outline" 
                                    placeholder="Confirm Password" 
                                    secureTextEntry
                                />
                            )}

                            {activeTab === 'register' && (
                                <TouchableOpacity 
                                    style={styles.checkboxContainer} 
                                    onPress={() => setAcceptPrivacy(!acceptPrivacy)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.checkbox, acceptPrivacy && styles.checkboxChecked]}>
                                        {acceptPrivacy && <Ionicons name="checkmark" size={14} color={theme.colors.background} />}
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

                            <PrimaryButton 
                                title={activeTab === 'login' ? 'Login' : 'Register'} 
                                onPress={handleAuth} 
                                style={styles.actionButton}
                            />
                        </View>
                    </GlassCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: theme.spacing.xl,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: theme.spacing.xl,
    },
    welcomeText: {
        fontSize: 26,
        fontFamily: 'Nunito_800ExtraBold',
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.lg,
    },
    cardContainer: {
        marginHorizontal: theme.spacing.lg,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(45, 58, 72, 0.5)',
        borderRadius: 20,
        padding: 4,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.primary20,
        borderWidth: 1,
    },
    tabText: {
        fontFamily: 'Poppins_600SemiBold',
        color: theme.colors.textSecondary,
        fontSize: 15,
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    formContainer: {
        gap: theme.spacing.lg,
    },
    phoneInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        height: 56,
        paddingHorizontal: theme.spacing.lg,
    },
    iconContainer: {
        marginRight: theme.spacing.md,
    },
    prefix: {
        fontFamily: 'Poppins_500Medium',
        color: theme.colors.primary,
        marginRight: 8,
        borderRightWidth: 1,
        borderRightColor: theme.colors.borderSoft,
        paddingRight: 8,
    },
    phoneTextInput: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        color: theme.colors.textPrimary,
        fontSize: 16,
    },
    forgotPassword: {
        textAlign: 'right',
        color: theme.colors.textSecondary,
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
    actionButton: {
        marginTop: theme.spacing.sm,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: theme.colors.primary,
    },
    checkboxLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    privacyLink: {
        color: theme.colors.primary,
        fontFamily: 'Poppins_600SemiBold',
    },
});
