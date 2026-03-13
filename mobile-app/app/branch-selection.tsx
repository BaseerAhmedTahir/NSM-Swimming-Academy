import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import AppBackground from '../components/ui/AppBackground';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';

const branches = [
    { id: 'DXB', name: 'Dubai', icon: 'location' },
    { id: 'SHJ', name: 'Sharjah', icon: 'location' },
    { id: 'AUH', name: 'Abu Dhabi', icon: 'location' }
];

export default function BranchSelectionScreen() {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const router = useRouter();

    const handleContinue = () => {
        if (selectedBranch) {
            router.replace('/(tabs)');
        }
    };

    return (
        <AppBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Select Branch</Text>
                        <Text style={styles.subtitle}>Choose your primary swimming academy location</Text>
                    </View>

                    <View style={styles.branchesContainer}>
                        {branches.map(branch => {
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
                                                name={branch.icon}
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
                        title="Continue to Dashboard"
                        onPress={handleContinue}
                        style={[styles.continueButton, !selectedBranch && styles.disabledButton]}
                        textStyle={!selectedBranch && styles.disabledButtonText}
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
        paddingTop: 80, // Extra padding for top
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
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        borderColor: theme.colors.primary,
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
    }
});

