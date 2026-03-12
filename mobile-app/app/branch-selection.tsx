import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.title}>Select Branch</Text>
                    <Text style={styles.subtitle}>Choose your primary swimming academy location</Text>
                </View>

                <View style={styles.branchesContainer}>
                    {branches.map(branch => (
                        <TouchableOpacity
                            key={branch.id}
                            style={[
                                styles.branchCard,
                                selectedBranch === branch.id && styles.selectedCard
                            ]}
                            onPress={() => setSelectedBranch(branch.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                selectedBranch === branch.id && styles.selectedIconContainer
                            ]}>
                                <Ionicons
                                    name={branch.icon}
                                    size={32}
                                    color={selectedBranch === branch.id ? colors.card : colors.primary}
                                />
                            </View>

                            <Text style={[
                                styles.branchName,
                                selectedBranch === branch.id && styles.selectedBranchName
                            ]}>
                                {branch.name}
                            </Text>

                            {selectedBranch === branch.id && (
                                <View style={styles.checkIcon}>
                                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !selectedBranch && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={!selectedBranch}
                >
                    <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.card} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Nunito_800ExtraBold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
        lineHeight: 24,
    },
    branchesContainer: {
        gap: 16,
    },
    branchCard: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(79, 195, 247, 0.05)',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    selectedIconContainer: {
        backgroundColor: colors.primary,
    },
    branchName: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: colors.textPrimary,
        flex: 1,
    },
    selectedBranchName: {
        color: colors.primaryDark,
    },
    checkIcon: {
        marginLeft: 10,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: colors.background,
    },
    continueButton: {
        backgroundColor: colors.primaryDark,
        borderRadius: 16,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: colors.textSecondary,
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: colors.card,
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
    }
});
