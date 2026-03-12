import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { scheduleData, students } from '../../data/mockData';

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
                                <View style={styles.classContent}>
                                    <View style={styles.classHeader}>
                                        <Text style={styles.classTitle}>{currentStudent.level} Swim Class</Text>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusText}>{cls.status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.classDetailRow}>
                                        <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                                        <Text style={styles.classDetailText}>{cls.coach}</Text>
                                    </View>
                                    <View style={styles.classDetailRow}>
                                        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                                        <Text style={styles.classDetailText}>{cls.branch} Branch</Text>
                                    </View>
                                    
                                    {cls.status === 'Upcoming' && (
                                        <TouchableOpacity 
                                            style={styles.cancelBtn}
                                            onPress={() => handleCancelClass(cls)}
                                        >
                                            <Ionicons name="close-circle-outline" size={16} color={colors.error || '#f44336'} />
                                            <Text style={styles.cancelBtnText}>Cancel Class</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <View style={styles.emptyCircle}>
                            <Ionicons name="water" size={48} color={colors.primary} />
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Nunito_900Black',
        color: colors.textPrimary,
    },
    dateSelectorContainer: {
        marginBottom: 20,
    },
    dateSelectorScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    dateCard: {
        width: 60,
        height: 80,
        borderRadius: 16,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedDateCard: {
        backgroundColor: colors.primaryDark,
    },
    dayName: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    dayNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: colors.textPrimary,
    },
    selectedDateText: {
        color: colors.card,
    },
    dateIndicator: {
        position: 'absolute',
        bottom: -6,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },
    classesList: {
        gap: 20,
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
        fontSize: 14,
        color: colors.textPrimary,
        marginTop: 16, // Align with card content top
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        position: 'absolute',
        right: 15,
        top: 20,
        zIndex: 1,
        borderWidth: 2,
        borderColor: colors.background,
    },
    timelineLine: {
        width: 2,
        backgroundColor: 'rgba(79, 195, 247, 0.3)',
        position: 'absolute',
        right: 20,
        top: 20,
        bottom: -20, // Connect to next card
    },
    classContent: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 16,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    classTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: colors.textPrimary,
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: 'rgba(38, 198, 218, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: colors.accentTeal,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
    },
    classDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    classDetailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
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
        backgroundColor: 'rgba(79, 195, 247, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
        marginBottom: 30,
    },
    bookBtn: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookBtnText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: colors.card,
    },
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(244, 67, 54, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.1)',
    },
    cancelBtnText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
        color: colors.error || '#f44336',
        marginLeft: 6,
    }
});
