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
                    id: 'demo-1', branch: currentStudent.branch, coach: 'Coach Ahmed', time: currentStudent.schedule.time, status: 'Upcoming'
                });
            }
        }

        return studentClasses;
    };

    const handleCancelClass = (cls) => {
        Alert.alert(
            "Cancel Class",
            `Are you sure you want to cancel your ${cls.time} class with ${cls.coach}?`,
            [
                { text: "No, Keep it", style: "cancel" },
                { 
                    text: "Yes, Cancel", 
                    style: "destructive",
                    onPress: () => {
                        // In a real app, this would call an API
                        Alert.alert("Success", "Your class has been cancelled.");
                    }
                }
            ]
        );
    };

    const currentClasses = getStudentClasses();

    return (
        <AppBackground>
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
                                    {isSelected && <View style={styles.dateIndicator} />}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

                    {currentClasses.length > 0 ? (
                        <View style={styles.classesList}>
                            {currentClasses.map((cls, idx) => (
                                <View key={cls.id || idx} style={styles.classCard}>
                                    <View style={styles.timeLineContainer}>
                                        <Text style={styles.timeText}>{cls.time}</Text>
                                        <View style={styles.timelineDot} />
                                        <View style={styles.timelineLine} />
                                    </View>
                                    <GlassCard style={styles.classContent} hasGlow={cls.status === 'Upcoming'}>
                                        <View style={styles.classHeader}>
                                            <Text style={styles.classTitle}>{currentStudent.level} Swim Class</Text>
                                            <View style={styles.statusBadge}>
                                                <Text style={styles.statusText}>{cls.status}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.classDetailRow}>
                                            <Ionicons name="person-outline" size={16} color={theme.colors.primary} />
                                            <Text style={styles.classDetailText}>{cls.coach}</Text>
                                        </View>
                                        <View style={styles.classDetailRow}>
                                            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
                                            <Text style={styles.classDetailText}>{cls.branch} Branch</Text>
                                        </View>
                                        
                                        {cls.status === 'Upcoming' && (
                                            <TouchableOpacity 
                                                style={styles.cancelBtn}
                                                onPress={() => handleCancelClass(cls)}
                                            >
                                                <Ionicons name="close-circle-outline" size={18} color={theme.colors.error || '#f44336'} />
                                                <Text style={styles.cancelBtnText}>Cancel Class</Text>
                                            </TouchableOpacity>
                                        )}
                                    </GlassCard>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyCircle}>
                                <Ionicons name="water" size={48} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>No Classes</Text>
                            <Text style={styles.emptySubtitle}>You don't have any classes scheduled for this day.</Text>

                            <TouchableOpacity style={styles.bookBtn}>
                                <Text style={styles.bookBtnText}>Request Makeup Class</Text>
                            </TouchableOpacity>
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
        padding: theme.spacing.xl,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Nunito_900Black',
        color: theme.colors.textPrimary,
    },
    dateSelectorContainer: {
        marginBottom: theme.spacing.lg,
    },
    dateSelectorScroll: {
        paddingHorizontal: theme.spacing.xl,
        gap: theme.spacing.md,
    },
    dateCard: {
        width: 65,
        height: 85,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(45, 58, 72, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    selectedDateCard: {
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        borderColor: theme.colors.primary,
    },
    dayName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    dayNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: theme.colors.textPrimary,
    },
    selectedDateText: {
        color: theme.colors.primary,
    },
    dateIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
    },
    listContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: 100,
        flexGrow: 1,
    },
    classesList: {
        gap: theme.spacing.xl,
    },
    classCard: {
        flexDirection: 'row',
    },
    timeLineContainer: {
        width: 75,
        alignItems: 'flex-start',
        position: 'relative',
    },
    timeText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: theme.colors.textPrimary,
        marginTop: 16, // Align with card content top
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        right: 15,
        top: 20,
        zIndex: 1,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    timelineLine: {
        width: 2,
        backgroundColor: 'rgba(11, 246, 246, 0.3)',
        position: 'absolute',
        right: 21,
        top: 20,
        bottom: -30, // Connect to next card
    },
    classContent: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    classTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: theme.colors.textPrimary,
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.3)',
    },
    statusText: {
        color: theme.colors.primary,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
    },
    classDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    classDetailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: theme.colors.textSecondary,
        marginLeft: 10,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.3)',
    },
    emptyTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 24,
        marginBottom: 30,
    },
    bookBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: theme.radius.md,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    bookBtnText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: theme.colors.background,
    },
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.3)',
    },
    cancelBtnText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.error || '#f44336',
        marginLeft: 8,
    }
});
