import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';

const toLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const generateDates = (): string[] => {
    const result: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        result.push(toLocalDateString(d));
    }
    return result;
};

export default function ScheduleScreen() {
    const [dates] = useState<string[]>(() => generateDates());
    const [selectedDate, setSelectedDate] = useState<string>(() => generateDates()[0]);
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    // In-app cancel modal state (replaces Alert.alert for cross-platform reliability)
    const [confirmModal, setConfirmModal] = useState<{ visible: boolean; cls: any | null; errorMsg: string | null; success: boolean }>({
        visible: false, cls: null, errorMsg: null, success: false
    });

    const getDayName = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getDayNum = (dateStr: string) => {
        return dateStr.split('-')[2].replace(/^0/, '');
    };

    const getMonthName = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    };

    const fetchSchedule = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/student-app/schedule');
            if (res.data.success) {
                setScheduleData(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching schedule', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const getStudentClasses = () => {
        return scheduleData.filter(cls => {
            if (!cls.schedule || !cls.schedule.date) return false;
            const raw = new Date(cls.schedule.date);
            const clsDate = toLocalDateString(new Date(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate()));
            return clsDate === selectedDate;
        }).map(cls => {
            let isPast = false;
            try {
                const parts = (cls.timeSlot || '0:0').split(' '); // e.g. "4:00 PM"
                const [hStr, mStr] = parts[0].split(':');
                let hour = parseInt(hStr) || 0;
                const min = parseInt(mStr) || 0;
                if (parts[1]?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
                if (parts[1]?.toUpperCase() === 'AM' && hour === 12) hour = 0;
                
                const clsDateObj = new Date(cls.schedule.date);
                clsDateObj.setUTCHours(hour, min, 0, 0);
                if (clsDateObj.getTime() < Date.now()) isPast = true;
            } catch { /* ignore */ }

            let displayStatus = cls.status || 'Upcoming';
            if (isPast && displayStatus === 'Upcoming') {
                displayStatus = 'Completed';
            }

            return {
                id: cls.id,
                branch: cls.schedule.branch?.name || 'Main',
                coach: cls.schedule.coach?.name || 'TBD',
                time: cls.timeSlot || 'TBD',
                status: displayStatus,
                isPast: isPast
            };
        });
    };

    const handleCancelPress = (cls: any) => {
        // Client-side 24-hr check for UX — backend enforces this too
        try {
            const [y, mo, d] = selectedDate.split('-').map(Number);
            const parts = cls.time.split(' '); // e.g. ["4:00", "PM"]
            const meridian = parts[1] || '';
            const [hoursStr, minutesStr] = (parts[0] || '0:0').split(':');
            let hour = parseInt(hoursStr) || 0;
            const minute = parseInt(minutesStr) || 0;
            if (meridian.toUpperCase() === 'PM' && hour !== 12) hour += 12;
            if (meridian.toUpperCase() === 'AM' && hour === 12) hour = 0;
            const classDateTime = new Date(y, mo - 1, d, hour, minute, 0);
            const hoursUntil = (classDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
            if (hoursUntil < 24) {
                // Show error-only modal (no cls stored so confirmation branch never renders)
                setConfirmModal({ visible: true, cls: null, errorMsg: 'Classes can only be cancelled at least 24 hours before the scheduled time.', success: false });
                return;
            }
        } catch (e) {
            // If time parsing fails, still show confirmation modal and let backend enforce
        }
        setConfirmModal({ visible: true, cls, errorMsg: null, success: false });
    };

    const handleConfirmCancel = async () => {
        const cls = confirmModal.cls;
        if (!cls) return;
        setCancellingId(cls.id);
        try {
            const res = await api.post('/student-app/cancel-class', {
                scheduleId: cls.id,
                reason: 'Cancelled by student',
            });
            if (res.data.success) {
                setConfirmModal({ visible: true, cls: null, errorMsg: null, success: true });
                fetchSchedule();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Could not cancel this class. Please try again.';
            setConfirmModal(prev => ({ ...prev, errorMsg: msg, success: false }));
        } finally {
            setCancellingId(null);
        }
    };

    const closeModal = () => setConfirmModal({ visible: false, cls: null, errorMsg: null, success: false });

    const currentClasses = getStudentClasses();

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>

                {/* ─── In-App Cancel Confirmation Modal ─── */}
                <Modal
                    transparent
                    animationType="fade"
                    visible={confirmModal.visible}
                    onRequestClose={closeModal}
                    statusBarTranslucent
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            {confirmModal.success ? (
                                <>
                                    <View style={[styles.modalIconCircle, { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22c55e' }]}>
                                        <Ionicons name="checkmark-circle" size={36} color="#22c55e" />
                                    </View>
                                    <Text style={styles.modalTitle}>Booking Cancelled</Text>
                                    <Text style={styles.modalBody}>Your class booking has been cancelled successfully.</Text>
                                    <TouchableOpacity style={styles.modalPrimaryBtn} onPress={closeModal}>
                                        <Text style={styles.modalPrimaryBtnText}>Done</Text>
                                    </TouchableOpacity>
                                </>
                            ) : confirmModal.errorMsg ? (
                                <>
                                    <View style={[styles.modalIconCircle, { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: '#ef4444' }]}>
                                        <Ionicons name="warning" size={36} color="#ef4444" />
                                    </View>
                                    <Text style={styles.modalTitle}>Cannot Cancel</Text>
                                    <Text style={styles.modalBody}>{confirmModal.errorMsg}</Text>
                                    <TouchableOpacity style={[styles.modalPrimaryBtn, { backgroundColor: '#ef4444' }]} onPress={closeModal}>
                                        <Text style={styles.modalPrimaryBtnText}>OK</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View style={[styles.modalIconCircle, { backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.4)' }]}>
                                        <Ionicons name="trash" size={32} color={theme.colors.error} />
                                    </View>
                                    <Text style={styles.modalTitle}>Cancel Booking?</Text>
                                    <Text style={styles.modalBody}>
                                        Cancel your <Text style={styles.modalHighlight}>{confirmModal.cls?.time}</Text> class with{' '}
                                        <Text style={styles.modalHighlight}>Coach {confirmModal.cls?.coach}</Text>?
                                        {'\n\n'}This action cannot be undone.
                                    </Text>
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.modalSecondaryBtn} onPress={closeModal} disabled={!!cancellingId}>
                                            <Text style={styles.modalSecondaryBtnText}>Keep it</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalPrimaryBtn, { flex: 1, backgroundColor: '#ef4444' }]}
                                            onPress={handleConfirmCancel}
                                            disabled={!!cancellingId}
                                        >
                                            {cancellingId ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text style={styles.modalPrimaryBtnText}>Yes, Cancel</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Schedule</Text>
                </View>

                {/* Horizontal Date Picker */}
                <View style={styles.dateSelectorContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dateSelectorScroll}
                    >
                        {dates.map((date) => {
                            const isSelected = selectedDate === date;
                            return (
                                <TouchableOpacity
                                    key={date}
                                    style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                                    onPress={() => setSelectedDate(date)}
                                    activeOpacity={0.7}
                                >
                                    <View style={isSelected ? styles.selectedDateInner : undefined}>
                                        <Text style={[styles.dayMonth, isSelected && styles.selectedDateText]}>
                                            {getMonthName(date)}
                                        </Text>
                                        <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
                                            {getDayName(date)}
                                        </Text>
                                        <Text style={[styles.dayNum, isSelected && styles.selectedDateText]}>
                                            {getDayNum(date)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

                    {loading ? (
                        <View style={styles.emptyStateContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>Loading your schedule...</Text>
                        </View>
                    ) : currentClasses.length > 0 ? (
                        <View style={styles.classesList}>
                            {currentClasses.map((cls) => (
                                <GlassCard key={cls.id} style={styles.classCard} hasGlow={true}>
                                    <View style={styles.classTopRow}>
                                        <View style={styles.classDateBox}>
                                            <Text style={styles.classMonth}>{getMonthName(selectedDate)}</Text>
                                            <Text style={styles.classDay}>{getDayNum(selectedDate)}</Text>
                                        </View>
                                        <View style={styles.classInfoMain}>
                                            <Text style={styles.classTitle}>Swim Class</Text>
                                            <View style={[styles.upcomingBadge, cls.isPast && { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
                                                <Text style={styles.statusText}>{cls.status}</Text>
                                            </View>
                                            <View style={styles.classDetRow}>
                                                <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                                                <Text style={styles.classDetText}>{cls.time}</Text>
                                            </View>
                                            <View style={styles.classDetRow}>
                                                <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
                                                <Text style={styles.classDetText}>{cls.branch} Branch</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    {/* Coach row — no hardcoded rating */}
                                    <View style={styles.coachRow}>
                                        <View style={styles.coachAvatar}>
                                            <Ionicons name="person" size={28} color="rgba(255,255,255,0.2)" />
                                        </View>
                                        <View style={styles.coachInfo}>
                                            <Text style={styles.coachName}>
                                                {cls.coach !== 'TBD' ? `Coach ${cls.coach}` : 'Coach TBD'}
                                            </Text>
                                            <Text style={styles.coachSubtitle}>Assigned Coach</Text>
                                        </View>
                                    </View>

                                    {(!cls.isPast && cls.status === 'Upcoming') && (
                                        <TouchableOpacity
                                            style={[styles.cancelBtn, cancellingId === cls.id && styles.cancelBtnDisabled]}
                                            onPress={() => handleCancelPress(cls)}
                                            disabled={cancellingId === cls.id}
                                        >
                                            {cancellingId === cls.id ? (
                                                <ActivityIndicator size="small" color={theme.colors.error} />
                                            ) : (
                                                <Text style={styles.cancelText}>Cancel Booking</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </GlassCard>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyCircle}>
                                <Ionicons name="water" size={48} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>No Classes</Text>
                            <Text style={styles.emptySubtitle}>You don't have any classes scheduled for this day.</Text>
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: theme.spacing.lg,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Nunito_900Black',
        color: theme.colors.textPrimary,
    },
    dateSelectorContainer: {
        marginBottom: 0,
    },
    dateSelectorScroll: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 20,
        gap: 10,
    },
    dateCard: {
        width: 60,
        height: 70,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1.2,
        borderColor: theme.colors.primary,
    },
    selectedDateCard: {
        backgroundColor: Platform.OS === 'android' ? '#00314b' : 'rgba(11,246,246,0.15)',
        borderColor: '#0bf6f6',
        shadowColor: '#0bf6f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 15,
    },
    selectedDateInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayMonth: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    dayName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 2,
    },
    dayNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
    },
    selectedDateText: {
        color: theme.colors.primary,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 160,
        flexGrow: 1,
    },
    classesList: {
        gap: 16,
    },
    classCard: {
        padding: 16,
        backgroundColor: theme.colors.surface,
        position: 'relative',
        borderWidth: 1.2,
        borderColor: theme.colors.primary,
        borderRadius: 16,
    },
    classTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    classDateBox: {
        backgroundColor: 'rgba(11, 246, 246, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        minWidth: 60,
        marginRight: 12,
    },
    classMonth: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 11,
        color: theme.colors.primary,
        opacity: 0.8,
    },
    classDay: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: '#ffffff',
    },
    classInfoMain: {
        flex: 1,
    },
    classTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    upcomingBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
    },
    statusText: {
        color: '#ffffff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    classDetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    classDetText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#ffffff',
        marginLeft: 6,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginVertical: 12,
    },
    coachRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    coachAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    coachInfo: {
        flex: 1,
    },
    coachName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.textPrimary,
        marginBottom: 2,
    },
    coachSubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    cancelBtn: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.08)',
    },
    cancelBtnDisabled: {
        opacity: 0.5,
    },
    cancelText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.error,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(11, 246, 246, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
    },
    emptyTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: theme.colors.textPrimary,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    // ─── Cancel Modal ───────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: '#0a1a2e',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(11,246,246,0.15)',
    },
    modalIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalBody: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#a0aab2',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalHighlight: {
        color: '#ffffff',
        fontFamily: 'Poppins_600SemiBold',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    modalPrimaryBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    modalPrimaryBtnText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
        color: '#000',
    },
    modalSecondaryBtn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    modalSecondaryBtnText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: '#ffffff',
    },
});
