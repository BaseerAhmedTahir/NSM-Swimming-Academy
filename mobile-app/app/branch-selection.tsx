import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import AppBackground from '../components/ui/AppBackground';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';

// Static branch list — no network required
const BRANCHES = [
    { id: 'dubai',    name: 'Dubai',     icon: 'location' },
    { id: 'sharjah',  name: 'Sharjah',   icon: 'location' },
    { id: 'abudhabi', name: 'Abu Dhabi', icon: 'location' },
];

export default function BranchSelectionScreen() {
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const router = useRouter();

    // Branch selection here is purely informational — the actual branch assigned to
    // the student is determined by the admin at registration time and returned during login.
    const handleContinue = () => {
        router.replace('/login');
    };

    return (
        <AppBackground style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Our Branches</Text>
                        <Text style={styles.subtitle}>NSM Swimming Academy operates across multiple locations. Your branch will be assigned when you log in.</Text>
                    </View>

                    <View style={styles.branchesContainer}>
                        {BRANCHES.map(branch => {
                            const isSelected = selectedBranch === branch.id;
                            return (
                                <TouchableOpacity
                                    key={branch.id}
                                    onPress={() => setSelectedBranch(branch.id)}
                                    activeOpacity={0.8}
                                >
                                    <GlassCard
                                        style={[
                                            styles.branchCard,
                                            isSelected && styles.selectedCard
                                        ]}
                                        hasGlow={isSelected}
                                    >
                                        <View style={[
                                            styles.iconContainer,
                                            isSelected && styles.selectedIconContainer
                                        ]}>
                                            <Ionicons
                                                name="location"
                                                size={28}
                                                color={isSelected ? theme.colors.background : theme.colors.primary}
                                            />
                                        </View>

                                        <Text style={[
                                            styles.branchName,
                                            isSelected && styles.selectedBranchName
                                        ]}>
                                            {branch.name}
                                        </Text>

                                        {isSelected && (
                                            <View style={styles.checkIcon}>
                                                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                            </View>
                                        )}
                                    </GlassCard>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
                        title="Continue to Login"
                        onPress={handleContinue}
                        style={styles.continueButton}
                    />
                </View>
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: theme.spacing.xl,
        paddingTop: 80,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Nunito_800ExtraBold',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    branchesContainer: {
        gap: theme.spacing.lg,
    },
    branchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    selectedCard: {
        backgroundColor: Platform.OS === 'android' ? '#00314b' : 'rgba(11, 246, 246, 0.08)',
        borderColor: 'rgba(11, 246, 246, 0.8)',
        borderWidth: 1.2,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 15,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    selectedIconContainer: {
        backgroundColor: theme.colors.primary,
    },
    branchName: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: theme.colors.textPrimary,
        flex: 1,
    },
    selectedBranchName: {
        color: theme.colors.primary,
        fontFamily: 'Poppins_700Bold',
    },
    checkIcon: {
        marginLeft: theme.spacing.sm,
    },
    footer: {
        padding: theme.spacing.xl,
        paddingBottom: 40,
    },
    continueButton: {
        height: 60,
    },
    disabledButton: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderSoft,
        borderWidth: 1,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledButtonText: {
        color: theme.colors.textSecondary,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    errorTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    errorSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(11,246,246,0.3)',
        backgroundColor: 'rgba(11,246,246,0.08)',
    },
    retryText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#0bf6f6',
    },
});
