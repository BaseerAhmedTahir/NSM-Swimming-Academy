import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { scheduleData, students } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

const currentStudent = students[0];
const dates = Object.keys(scheduleData).sort();

export default function ScheduleScreen() {
    const [selectedDate, setSelectedDate] = useState(dates[1]); // Mock: select today (second date)

    const getDayName = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getDayNum = (dateStr) => {
        return new Date(dateStr).getDate().toString();
    };

    // Mock finding classes for the current student on a selected date across all branches
    const getStudentClasses = () => {
        let studentClasses = [];
        const dateData = scheduleData[selectedDate];
        if (!dateData) return [];

        Object.keys(dateData).forEach(branch => {
            const branchStaff = dateData[branch].coaches;
            if (!branchStaff) return;
            Object.keys(branchStaff).forEach(coachName => {
                const timeSlots = branchStaff[coachName];
                Object.keys(timeSlots).forEach(time => {
                    const slotStudents = timeSlots[time];
                    // Exact match lookup using our mock identity string
                    const identityStr = `${currentStudent.name}${currentStudent.age}${currentStudent.level}`;
                    if (slotStudents.includes(identityStr)) {
                        studentClasses.push({
                            id: `${branch}-${coachName}-${time}`,
                            branch,
                            coach: coachName,
                            time,
                            status: 'Upcoming'
                        });
                    }
                });
            });
        });

        // Add mock dynamic items if empty for presentation
        if (studentClasses.length === 0) {
            // Only show mock classes if we pick the active mock date 1
            if (selectedDate === dates[1]) {
                studentClasses.push({
                    id: 'demo-1', branch: currentStudent.branch, coach: 'Coach Tariq', time: currentStudent.schedule.time, status: 'Upcoming'
                });
            }
        }

        return studentClasses;
    };

    const handleCancelClass = (cls) => {
        Alert.alert(
            "Cancel Booking",
            `Are you sure you want to cancel your ${cls.time} booking with ${cls.coach}?`,
            [
                { text: "No, Keep it", style: "cancel" },
                { 
                    text: "Yes, Cancel", 
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Success", "Your booking has been cancelled.");
                    }
                }
            ]
        );
    };

    const currentClasses = getStudentClasses();

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
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
                        {dates.map((date, index) => {
                            const isSelected = selectedDate === date;
                            return (
                                <TouchableOpacity
                                    key={date}
                                    style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
                                        {getDayName(date)}
                                    </Text>
                                    <Text style={[styles.dayNum, isSelected && styles.selectedDateText]}>
                                        {getDayNum(date)}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

                    {currentClasses.length > 0 ? (
                        <View style={styles.classesList}>
                            {currentClasses.map((cls, idx) => (
                                <GlassCard key={idx} style={styles.classCard} hasGlow={true}>
                                    <View style={styles.classTopRow}>
                                        <View style={styles.classDateBox}>
                                            <Text style={styles.classMonth}>FEB</Text>
                                            <Text style={styles.classDay}>24</Text>
                                        </View>
                                        <View style={styles.classInfoMain}>
                                            <Text style={styles.classTitle}>{currentStudent.level} Swim Class</Text>
                                            <View style={styles.upcomingBadge}>
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

                                    <View style={styles.coachRow}>
                                        <View style={styles.coachAvatar}>
                                            <Ionicons name="person" size={28} color="rgba(255,255,255,0.2)" />
                                        </View>
                                        <View style={styles.coachInfo}>
                                            <Text style={styles.coachName}>{cls.coach}</Text>
                                            <View style={styles.ratingRow}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Ionicons 
                                                        key={star} 
                                                        name={star <= 4 ? "star" : "star-outline"} 
                                                        size={14} 
                                                        color={star <= 4 ? theme.colors.primary : "rgba(11,246,246,0.3)"} 
                                                    />
                                                ))}
                                                <Text style={styles.ratingText}>(3.5 / 5)</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.cancelBtn}
                                        onPress={() => handleCancelClass(cls)}
                                    >
                                        <Text style={styles.cancelText}>Cancel Booking</Text>
                                    </TouchableOpacity>
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
        marginBottom: 20,
    },
    dateSelectorScroll: {
        paddingHorizontal: theme.spacing.lg,
        gap: 10,
    },
    dateCard: {
        width: 54,
        height: 72,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    selectedDateCard: {
        backgroundColor: 'rgba(11, 246, 246, 0.12)',
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dayName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginBottom: 4,
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
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        position: 'relative',
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
        color: theme.colors.primary,
    },
    classInfoMain: {
        flex: 1,
    },
    classTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
        marginBottom: 4,
        paddingRight: 80, // Space for badge
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
        color: theme.colors.primary,
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
        color: theme.colors.textSecondary,
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
        marginBottom: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginLeft: 4,
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
    }
});
