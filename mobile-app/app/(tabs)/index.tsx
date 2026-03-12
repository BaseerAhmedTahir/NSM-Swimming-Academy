import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { students, notifications } from '../../data/mockData';

// Mock specific student for prototype
const currentStudent = students[0];
const unreadNotifications = notifications.filter(n => !n.read).length;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.name}>{currentStudent.name}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.branchBadge}>
                <Ionicons name="location" size={12} color={colors.primaryDark} />
                <Text style={styles.branchText}>{currentStudent.branch}</Text>
              </View>
              <TouchableOpacity style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={28} color={colors.textPrimary} />
                {unreadNotifications > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadNotifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={[styles.statCard, { backgroundColor: 'rgba(79, 195, 247, 0.1)' }]}>
            <Ionicons name="medal" size={24} color={colors.primary} />
            <Text style={styles.statLabel}>Current Level</Text>
            <Text style={styles.statValue}>{currentStudent.level}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: 'rgba(38, 198, 218, 0.1)' }]}>
            <Ionicons name="card" size={24} color={colors.accentTeal} />
            <Text style={styles.statLabel}>Membership</Text>
            <Text style={styles.statValue}>{currentStudent.membership}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: 'rgba(102, 187, 106, 0.1)' }]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>{currentStudent.attendance.attended}/{currentStudent.attendance.totalClasses}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: currentStudent.fee.status === 'Paid' ? 'rgba(102, 187, 106, 0.1)' : 'rgba(255, 167, 38, 0.1)' }]}>
            <Ionicons name={currentStudent.fee.status === 'Paid' ? 'cash' : 'alert-circle'} size={24} color={currentStudent.fee.status === 'Paid' ? colors.success : colors.warning} />
            <Text style={styles.statLabel}>Fee Status</Text>
            <Text style={[styles.statValue, { color: currentStudent.fee.status === 'Paid' ? colors.success : colors.warning }]}>{currentStudent.fee.status}</Text>
          </View>
        </ScrollView>

        {/* Next Class Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.classCard}>
          <View style={styles.classDateBox}>
            <Text style={styles.classMonth}>FEB</Text>
            <Text style={styles.classDay}>24</Text>
          </View>
          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>{currentStudent.level} Swimming Class</Text>
            <View style={styles.classDetRow}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.classDetText}>{currentStudent.schedule.time}</Text>
            </View>
            <View style={styles.classDetRow}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.classDetText}>Coach Ahmed</Text>
            </View>
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
        </View>

        <View style={styles.notificationList}>
          {notifications.slice(0, 2).map((notif, index) => (
            <View key={index} style={[styles.notificationItem, !notif.read && styles.unreadNotif]}>
              <View style={[styles.notifIconBox, { backgroundColor: notif.type === 'holiday' ? 'rgba(239, 83, 80, 0.1)' : 'rgba(79, 195, 247, 0.1)' }]}>
                <Ionicons
                  name={notif.type === 'holiday' ? 'calendar' : notif.type === 'fee' ? 'wallet' : 'information-circle'}
                  size={20}
                  color={notif.type === 'holiday' ? colors.error : colors.primaryDark}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifMsg} numberOfLines={2}>{notif.message}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </View>
          ))}
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
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  name: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 195, 247, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.3)',
  },
  branchText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: colors.primaryDark,
    marginLeft: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
  },
  statsContainer: {
    gap: 12,
    marginBottom: 30,
    paddingRight: 20,
  },
  statCard: {
    width: 120,
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  statLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  classCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
    alignItems: 'center',
  },
  classDateBox: {
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
    marginRight: 16,
  },
  classMonth: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: colors.primaryDark,
  },
  classDay: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    color: colors.primaryDark,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  classDetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classDetText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  notificationList: {
    gap: 12,
  },
  notificationItem: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadNotif: {
    borderLeftColor: colors.primary,
    backgroundColor: 'rgba(79, 195, 247, 0.03)',
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notifMsg: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 10,
  }
});
