import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { students } from '../../data/mockData';

const currentStudent = students[0];

export default function ProfileScreen() {
    const getMembershipColor = (type) => {
        switch (type) {
            case 'Gold': return '#FFD700';
            case 'Platinum': return '#37474F';
            case 'Silver': return '#B0BEC5';
            default: return colors.primary;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.headerBox}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={50} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.name}>{currentStudent.name}</Text>
                    <Text style={styles.studentId}>{currentStudent.id}</Text>
                    <View style={styles.badgesRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{currentStudent.branch}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.accentTeal }]}>
                            <Text style={styles.badgeText}>{currentStudent.level}</Text>
                        </View>
                    </View>
                </View>

                {/* Section A: Class Schedule */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTextPrimary}>{currentStudent.schedule.days.join(' & ')}</Text>
                        <Text style={styles.cardTextSecondary}>{currentStudent.schedule.time}</Text>
                    </View>
                </View>

                {/* Section B: Membership Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="card-outline" size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Membership</Text>
                    </View>
                    <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: getMembershipColor(currentStudent.membership) }]}>
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
                    </View>
                </View>

                {/* Section C: Attendance History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Attendance</Text>
                    </View>
                    <View style={styles.card}>
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
                    </View>
                </View>

                {/* Section D: Fee Status */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Fee Status</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.cardLabel}>Status</Text>
                            <View style={[styles.statusBadge, { backgroundColor: currentStudent.fee.status === 'Paid' ? colors.success : colors.warning }]}>
                                <Text style={styles.statusBadgeText}>{currentStudent.fee.status}</Text>
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
                    </View>
                </View>

                {/* Section E & F: Swimming Level & Assessment */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="medal-outline" size={20} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Level & Assessment</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.levelContainer}>
                            <Text style={styles.cardLabel}>Current Milestone</Text>
                            <Text style={styles.levelBig}>{currentStudent.level}</Text>
                            <Text style={styles.levelCategory}>{currentStudent.category}</Text>
                        </View>

                        {currentStudent.assessmentPassDate && (
                            <View style={styles.assessmentBox}>
                                <Ionicons name="star" size={16} color={colors.accentYellow} />
                                <Text style={styles.assessmentText}>Passed on {new Date(currentStudent.assessmentPassDate).toLocaleDateString()}</Text>
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.rowBetween}>
                            <Text style={styles.cardLabel}>Renewals</Text>
                            <Text style={styles.cardValue}>{currentStudent.renewalCount} term(s)</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    name: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        color: colors.textPrimary,
    },
    studentId: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 10,
    },
    badge: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: colors.card,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: colors.textPrimary,
        marginLeft: 8,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTextPrimary: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: colors.textPrimary,
    },
    cardTextSecondary: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: colors.primary,
        marginTop: 4,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: colors.textSecondary,
    },
    cardValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
        marginVertical: 12,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
        color: colors.primaryDark,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: 'rgba(79, 195, 247, 0.2)',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: 5,
    },
    attendanceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        alignItems: 'center',
    },
    statNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: colors.textPrimary,
    },
    statDesc: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: colors.card,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
    },
    levelContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    levelBig: {
        fontFamily: 'Nunito_900Black',
        fontSize: 42,
        color: colors.primaryDark,
        marginVertical: 4,
    },
    levelCategory: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: colors.accentTeal,
    },
    assessmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 213, 79, 0.15)',
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 10,
    },
    assessmentText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#F57F17',
        marginLeft: 6,
    }
});
