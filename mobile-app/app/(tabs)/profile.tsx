import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { students } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

const currentStudent = students[0];

export default function ProfileScreen() {
    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Header */}
                    <View style={styles.headerBox}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarBorder}>
                                <Ionicons name="person" size={55} color="rgba(255,255,255,0.3)" />
                            </View>
                        </View>
                        <Text style={styles.name}>{currentStudent.name}</Text>
                        <Text style={styles.studentId}>{currentStudent.id}</Text>
                        <View style={styles.badgesRow}>
                            <View style={styles.branchBadge}>
                                <Ionicons name="location" size={14} color={theme.colors.primary} />
                                <Text style={styles.branchName}>{currentStudent.branch}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section: Membership Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Membership Details</Text>
                        </View>
                        <GlassCard style={styles.detailsCard}>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconBox}>
                                    <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Membership Type</Text>
                                    <Text style={styles.detailValue}>{currentStudent.membership}</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconBox}>
                                    <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Expiry Date</Text>
                                    <Text style={styles.detailValue}>{new Date(currentStudent.attendance.expiryDate).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconBox}>
                                    <Ionicons name="medal-outline" size={20} color={theme.colors.primary} />
                                </View>
                                <View style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Current Level</Text>
                                    <Text style={styles.detailValue}>{currentStudent.level}</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section: Attendance Performance */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Attendance Performance</Text>
                        </View>
                        <GlassCard style={styles.attendanceCard}>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{currentStudent.attendance.attended}</Text>
                                    <Text style={styles.statLabel}>Present</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{currentStudent.attendance.absentDates.length}</Text>
                                    <Text style={styles.statLabel}>Absent</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{currentStudent.attendance.pending}</Text>
                                    <Text style={styles.statLabel}>Left</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section: Settings/Actions */}
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.actionItem}>
                            <GlassCard style={styles.actionCard}>
                                <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
                                <Text style={styles.actionText}>App Settings</Text>
                                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                            </GlassCard>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionItem}>
                            <GlassCard style={styles.actionCard}>
                                <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                                <Text style={[styles.actionText, { color: theme.colors.error }]}>Log Out</Text>
                            </GlassCard>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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
        paddingBottom: 120,
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        padding: 5,
        marginBottom: 15,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    avatarBorder: {
        flex: 1,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 28,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    studentId: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 15,
    },
    badgesRow: {
        flexDirection: 'row',
    },
    branchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(11, 246, 246, 0.12)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.25)',
    },
    branchName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.primary,
        marginLeft: 6,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: theme.colors.textPrimary,
    },
    detailsCard: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    detailIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(11, 246, 246, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.15)',
    },
    detailText: {
        flex: 1,
    },
    detailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: theme.colors.textPrimary,
    },
    attendanceCard: {
        padding: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    actionItem: {
        marginBottom: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    actionText: {
        flex: 1,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: theme.colors.textPrimary,
        marginLeft: 15,
    }
});
