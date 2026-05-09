import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { students } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../../lib/storage';
import api from '../../lib/api';

// Shorten long branch names to just the city for compact display
const shortenBranchName = (name: string): string => {
    if (!name) return name;
    const lower = name.toLowerCase();
    if (lower.includes('dubai'))     return 'Dubai';
    if (lower.includes('sharjah'))   return 'Sharjah';
    if (lower.includes('abu dhabi')) return 'Abu Dhabi';
    return name; // fallback: return as-is
};

export default function ProfileScreen() {
    const router = useRouter();
    const [branchName, setBranchName] = useState('My Branch');
    const [student, setStudent] = useState<any>(null);
    const [attendance, setAttendance] = useState({ attended: 0, absent: 0, totalClasses: 24, freeClasses: 0 });
    const [loading, setLoading] = useState(true);

    // Review state
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedBranch = await AsyncStorage.getItem('selectedBranchName');
                if (storedBranch) setBranchName(shortenBranchName(storedBranch));

                const [profRes, attRes] = await Promise.all([
                    api.get('/student-app/profile').catch(() => ({ data: { success: false } })),
                    api.get('/student-app/attendance').catch(() => ({ data: { success: false } }))
                ]);

                if (profRes.data.success) {
                    const profileData = profRes.data.data;
                    setStudent(profileData);
                    if (!storedBranch && profileData.branch) setBranchName(shortenBranchName(profileData.branch.name));
                    // Use real totalClasses and freeClasses from server
                    setAttendance(prev => ({
                        ...prev,
                        totalClasses: profileData.totalClasses || 0,
                        freeClasses: profileData.freeClasses || 0,
                    }));
                    if (profileData.review) {
                        setReviewRating(profileData.review.rating);
                        setReviewText(profileData.review.text || '');
                        setReviewSubmitted(true);
                    }
                }

                if (attRes.data.success) {
                    const records = attRes.data.data;
                    const attended = records.filter((r: any) => r.status === 'ATTENDED' || r.status === 'PRESENT').length;
                    const absent = records.filter((r: any) => r.status === 'ABSENT' || r.status === 'INFORMED_ABSENT').length;
                    setAttendance(prev => ({ ...prev, attended, absent }));
                }
            } catch (error) {
                console.error("Profile load error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            // Revoke refresh token on backend (best-effort)
            const refreshToken = await storage.getItem('refreshToken');
            if (refreshToken) {
                api.post('/auth/logout', { refreshToken }).catch(() => {});
            }

            // Clear all stored auth data and branch selection
            await Promise.all([
                storage.removeItem('userToken'),
                storage.removeItem('refreshToken'),
                storage.removeItem('userData'),
                AsyncStorage.removeItem('selectedBranchId'),
                AsyncStorage.removeItem('selectedBranchName'),
            ]);

            router.replace('/login');
        } catch (error) {
            console.error(error);
            router.replace('/login');
        }
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating before submitting.');
            return;
        }
        setIsSubmittingReview(true);
        try {
            await api.post('/student-app/review', { rating: reviewRating, text: reviewText.trim() || undefined });
            setStudent((prev: any) => ({ ...prev, review: { rating: reviewRating, text: reviewText.trim() || undefined } }));
            setReviewSubmitted(true);
            Alert.alert(
                '🌟 Thank You!',
                'Your review has been submitted. Would you like to also leave a review on Google Maps?',
                [
                    { text: 'Not now', style: 'cancel' },
                    { text: 'Open Google Maps', onPress: () => Linking.openURL('https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_MAPS_LINK/review') }
                ]
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleDeleteReview = async () => {
        const doDelete = async () => {
            try {
                await api.delete('/student-app/review');
                setReviewRating(0);
                setReviewText('');
                setReviewSubmitted(false);
                setStudent((prev: any) => ({ ...prev, review: null }));
                if (Platform.OS === 'web') {
                    window.alert('Your review has been deleted.');
                } else {
                    Alert.alert('Deleted', 'Your review has been deleted.');
                }
            } catch (err: any) {
                const errMsg = err?.response?.data?.message || err?.response?.data?.error?.details || err.message || 'Unknown error';
                if (Platform.OS === 'web') {
                    window.alert(`Failed to delete review: ${errMsg}`);
                } else {
                    Alert.alert('Error', `Failed to delete review: ${errMsg}`);
                }
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete your review?')) {
                doDelete();
            }
        } else {
            Alert.alert(
                'Delete Review',
                'Are you sure you want to delete your review?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: doDelete
                    }
                ]
            );
        }
    };

    if (loading || !student) {
        return (
            <AppBackground style={styles.container}>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]} edges={['top']}>
                    <Text style={{color: 'white'}}>Loading Profile...</Text>
                </SafeAreaView>
            </AppBackground>
        );
    }

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
                        <Text style={styles.name}>{student.name || 'Student Name'}</Text>

                        <View style={styles.badgesRow}>
                            <View style={styles.pillBadge}>
                                <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
                                <Text style={styles.badgeText}>{branchName}</Text>
                            </View>
                            <Text style={styles.studentId}>{student.studentId || 'NSM-000'}</Text>
                            <View style={styles.pillBadge}>
                                <Ionicons name="medal-outline" size={14} color={theme.colors.primary} />
                                <Text style={styles.badgeText}>{student.level || '-'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Weekly Schedule */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderLine}>
                            <Ionicons name="calendar-outline" size={22} color={theme.colors.primary} style={styles.sectionIcon} />
                            <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                        </View>
                        <GlassCard style={styles.cardLayout}>
                            <Text style={styles.scheduleDays}>Based on Assigned Slots</Text>
                            <Text style={styles.scheduleTime}>Check 'Schedule' Tab for times</Text>
                        </GlassCard>
                    </View>

                    {/* Section: Membership Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderLine}>
                            <Ionicons name="card-outline" size={22} color={theme.colors.primary} style={styles.sectionIcon} />
                            <Text style={styles.sectionTitle}>Membership</Text>
                        </View>
                        <GlassCard style={styles.cardLayout}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardLabel}>Type</Text>
                                <Text style={styles.cardValue}>{student.packageType || '-'}</Text>
                            </View>
                            <View style={[styles.rowBetween, { marginTop: 24 }]}>
                                <Text style={styles.cardLabel}>Validity</Text>
                                <Text style={styles.cardValue}>{student.membershipExpiryDate ? new Date(student.membershipExpiryDate).toLocaleDateString() : 'Active'}</Text>
                            </View>
                        </GlassCard>
                    </View>

                    {/* Section: Attendance Performance */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderLine}>
                            <Ionicons name="checkmark-circle-outline" size={22} color={theme.colors.primary} style={styles.sectionIcon} />
                            <Text style={styles.sectionTitle}>Attendance</Text>
                        </View>
                        <GlassCard style={styles.attendanceCardLayout}>
                            <View style={[styles.rowBetween, { marginBottom: 12 }]}>
                                <Text style={styles.cardLabel}>Attended Classes</Text>
                                <Text style={styles.cardValueHighlight}>{attendance.attended} / {attendance.totalClasses + attendance.freeClasses}</Text>
                            </View>

                            {/* Progress bar */}
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${Math.min(100, (attendance.attended / (attendance.totalClasses + attendance.freeClasses)) * 100)}%` }]} />
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{attendance.attended}</Text>
                                    <Text style={styles.statLabelSm}>Present</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{attendance.absent}</Text>
                                    <Text style={styles.statLabelSm}>Absent</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{(attendance.totalClasses + attendance.freeClasses) - attendance.attended}</Text>
                                    <Text style={styles.statLabelSm}>Remaining</Text>
                                </View>
                            </View>
                            {attendance.freeClasses > 0 && (
                                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(11,246,246,0.15)'}}>
                                    <View style={{backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)'}}>
                                        <Text style={{fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: '#10b981'}}>
                                            {attendance.totalClasses} Package + {attendance.freeClasses} Free Classes
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </GlassCard>
                    </View>

                    {/* Section: Rate Your Experience */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderLine}>
                            <Ionicons name="star-outline" size={22} color={theme.colors.primary} style={styles.sectionIcon} />
                            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
                        </View>
                        <GlassCard style={styles.cardLayout}>
                            {reviewSubmitted ? (
                                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                                    <Ionicons name="checkmark-circle" size={40} color="#0bf6f6" />
                                    <Text style={{ color: '#ffffff', fontFamily: 'Poppins_600SemiBold', fontSize: 15, marginTop: 8, textAlign: 'center' }}>
                                        Review submitted! Thank you 🌟
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => setReviewSubmitted(false)} style={{ marginHorizontal: 15 }}>
                                            <Text style={{ color: '#0bf6f6', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>Edit Review</Text>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={handleDeleteReview} style={{ marginHorizontal: 15 }}>
                                            <Text style={{ color: theme.colors.error, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>Delete</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Text style={{ color: '#a0aab2', fontFamily: 'Poppins_400Regular', fontSize: 13, marginBottom: 12 }}>
                                        How would you rate your experience at NSM Swimming Academy?
                                    </Text>
                                    {/* Star Rating */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity key={star} onPress={() => setReviewRating(star)} style={{ paddingHorizontal: 6 }}>
                                                <Ionicons
                                                    name={star <= reviewRating ? "star" : "star-outline"}
                                                    size={36}
                                                    color={star <= reviewRating ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {/* Text review */}
                                    <TextInput
                                        style={styles.reviewTextInput}
                                        placeholder="Share your experience (optional)..."
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        multiline
                                        numberOfLines={3}
                                        value={reviewText}
                                        onChangeText={setReviewText}
                                        maxLength={500}
                                    />
                                    {student?.review ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity
                                                style={[styles.reviewSubmitBtn, { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#0bf6f6', marginRight: 10 }]}
                                                onPress={() => {
                                                    setReviewRating(student.review.rating);
                                                    setReviewText(student.review.text || '');
                                                    setReviewSubmitted(true);
                                                }}
                                                disabled={isSubmittingReview}
                                            >
                                                <Text style={[styles.reviewSubmitBtnText, { color: '#0bf6f6' }]}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.reviewSubmitBtn, { flex: 1, marginLeft: 10 }, reviewRating === 0 && { opacity: 0.5 }]}
                                                onPress={handleSubmitReview}
                                                disabled={isSubmittingReview || reviewRating === 0}
                                            >
                                                <Text style={styles.reviewSubmitBtnText}>
                                                    {isSubmittingReview ? 'Saving...' : 'Save Review'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={[styles.reviewSubmitBtn, reviewRating === 0 && { opacity: 0.5 }]}
                                            onPress={handleSubmitReview}
                                            disabled={isSubmittingReview || reviewRating === 0}
                                        >
                                            <Text style={styles.reviewSubmitBtnText}>
                                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </GlassCard>
                    </View>

                    {/* Section: Settings/Actions */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={handleLogout}
                        >
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
        padding: theme.spacing.lg,
        paddingBottom: 160,
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1.2,
        borderColor: '#0bf6f6',
        padding: 4,
        marginBottom: 12,
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
        fontSize: 24,
        color: theme.colors.textPrimary,
        marginBottom: 3,
    },
    studentId: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#ffffff',
        marginHorizontal: 12,
    },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.2,
        borderColor: '#0bf6f6',
    },
    badgeText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
        color: '#ffffff',
        marginLeft: 6,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeaderLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: '#ffffff',
    },
    cardLayout: {
        padding: 20,
        backgroundColor: 'rgba(0, 15, 31, 0.1)', // More transparent
        borderRadius: 16,
        borderWidth: 1.2,
        borderColor: '#0bf6f6',
    },
    attendanceCardLayout: {
        padding: 20,
        backgroundColor: 'rgba(0, 15, 31, 0.1)', // More transparent
        borderRadius: 16,
        borderWidth: 1.2,
        borderColor: '#0bf6f6',
    },
    scheduleDays: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 8,
    },
    scheduleTime: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#0bf6f6',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#a0aab2',
    },
    cardValue: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#ffffff',
    },
    cardValueHighlight: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#0bf6f6',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        width: '100%',
        marginVertical: 16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0bf6f6',
        borderRadius: 3,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabelSm: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#a0aab2',
    },
    reviewTextInput: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(11,246,246,0.3)',
        color: '#ffffff',
        padding: 12,
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        marginBottom: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    reviewSubmitBtn: {
        backgroundColor: '#0bf6f6',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    reviewSubmitBtnText: {
        color: '#001c3d',
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
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
