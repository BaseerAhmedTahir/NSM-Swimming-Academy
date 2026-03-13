import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { students } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

const currentStudent = students[0];

export default function ProfileScreen() {
    const getMembershipColor = (type) => {
        switch (type) {
            case 'Gold': return '#FFD700';
            case 'Platinum': return '#ECEFF1';
            case 'Silver': return '#B0BEC5';
            default: return theme.colors.primary;
        }
    };

    return (
        <AppBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Header */}
                    <View style={styles.headerBox}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={50} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.name}>{currentStudent.name}</Text>
                        <Text style={styles.studentId}>{currentStudent.id}</Text>
                        <View style={styles.badgesRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{currentStudent.branch}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: 'rgba(11, 246, 246, 0.2)' }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{currentStudent.level}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section A: Class Schedule */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                        </View>
                        <GlassCard style={styles.card}>
                            <Text style={styles.cardTextPrimary}>{currentStudent.schedule.days.join(' & ')}</Text>
                            <Text style={styles.cardTextSecondary}>{currentStudent.schedule.time}</Text>
                        </GlassCard>
                    </View>

                    {/* Section B: Membership Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Membership</Text>
                        </View>
                        <GlassCard style={[styles.card, { borderLeftWidth: 4, borderLeftColor: getMembershipColor(currentStudent.membership) }]}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Type</Text>
                                <Text style={[styles.cardValue, { color: getMembershipColor(currentStudent.membership) }]}>
                                    {currentStudent.membership}
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Validity</Text>
                                <Text style={styles.cardValue}>
                                    {new Date(currentStudent.attendance.startDate).toLocaleDateString()} - {new Date(currentStudent.attendance.expiryDate).toLocaleDateString()}
                                </Text>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section C: Attendance History */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="checkmark-done-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Attendance</Text>
                        </View>
                        <GlassCard style={styles.card}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.cardLabel}>Attended Classes</Text>
                                <Text style={styles.progressText}>
                                    {currentStudent.attendance.attended} / {currentStudent.attendance.totalClasses}
                                </Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${(currentStudent.attendance.attended / currentStudent.attendance.totalClasses) * 100}%` }
                                    ]}
                                />
                            </View>
                            <View style={styles.attendanceStats}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNum}>{currentStudent.attendance.attended}</Text>
                                    <Text style={styles.statDesc}>Present ✅</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNum}>{currentStudent.attendance.absentDates.length}</Text>
                                    <Text style={styles.statDesc}>Absent ❌</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNum}>{currentStudent.attendance.pending}</Text>
                                    <Text style={styles.statDesc}>Remaining ⏳</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section D: Fee Status */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Fee Status</Text>
                        </View>
                        <GlassCard style={styles.card}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Status</Text>
                                <View style={[styles.statusBadge, { backgroundColor: currentStudent.fee.status === 'Paid' ? 'rgba(102, 187, 106, 0.15)' : 'rgba(255, 167, 38, 0.15)' }]}>
                                    <Text style={[styles.statusBadgeText, { color: currentStudent.fee.status === 'Paid' ? theme.colors.success : theme.colors.warning }]}>{currentStudent.fee.status}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Amount</Text>
                                <Text style={styles.cardValue}>AED {currentStudent.fee.amount}</Text>
                            </View>
                            {currentStudent.fee.paidDate && (
                                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                                    <Text style={styles.cardLabel}>Paid On</Text>
                                    <Text style={styles.cardValue}>{new Date(currentStudent.fee.paidDate).toLocaleDateString()}</Text>
                                </View>
                            )}
                            <View style={[styles.rowBetween, { marginTop: 10 }]}>
                                <Text style={styles.cardLabel}>Payment Mode</Text>
                                <Text style={styles.cardValue}>{currentStudent.fee.paymentMode}</Text>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section E & F: Swimming Level & Assessment */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medal-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Level & Assessment</Text>
                        </View>
                        <GlassCard style={styles.card}>
                            <View style={styles.levelContainer}>
                                <Text style={styles.cardLabel}>Current Milestone</Text>
                                <Text style={styles.levelBig}>{currentStudent.level}</Text>
                                <Text style={styles.levelCategory}>{currentStudent.category}</Text>
                            </View>

                            {currentStudent.assessmentPassDate && (
                                <View style={styles.assessmentBox}>
                                    <Ionicons name="star" size={16} color="#F57F17" />
                                    <Text style={styles.assessmentText}>Passed on {new Date(currentStudent.assessmentPassDate).toLocaleDateString()}</Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Renewals</Text>
                                <Text style={styles.cardValue}>{currentStudent.renewalCount} term(s)</Text>
                            </View>
                        </GlassCard>
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
        paddingBottom: 100,
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: 'rgba(11, 246, 246, 0.5)',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    name: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 26,
        color: theme.colors.textPrimary,
    },
    studentId: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: theme.colors.textSecondary,
        marginBottom: 12,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 12,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    badgeText: {
        color: theme.colors.textPrimary,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: theme.colors.textPrimary,
        marginLeft: 10,
    },
    card: {
        padding: theme.spacing.lg,
    },
    cardTextPrimary: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
    },
    cardTextSecondary: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 15,
        color: theme.colors.primary,
        marginTop: 6,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    cardValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: theme.colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 14,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15,
        color: theme.colors.primary,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.success,
        borderRadius: 6,
    },
    attendanceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.sm,
    },
    statBox: {
        alignItems: 'center',
    },
    statNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
    },
    statDesc: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusBadgeText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
    },
    levelContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    levelBig: {
        fontFamily: 'Nunito_900Black',
        fontSize: 48,
        color: theme.colors.primary,
        marginVertical: 8,
        textShadowColor: 'rgba(11, 246, 246, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    levelCategory: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: 'rgba(11, 246, 246, 0.8)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    assessmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(245, 127, 23, 0.15)',
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 127, 23, 0.3)',
    },
    assessmentText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFD54F',
        marginLeft: 8,
    }
});
