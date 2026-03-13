import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { students, notifications } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

// Mock specific student for prototype
const currentStudent = students[0];
const unreadNotifications = notifications.filter(n => !n.read).length;

export default function HomeScreen() {
  return (
    <AppBackground>
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
                  <Ionicons name="location" size={14} color={theme.colors.primary} />
                  <Text style={styles.branchText}>{currentStudent.branch}</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                  <Ionicons name="notifications-outline" size={28} color={theme.colors.textPrimary} />
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
            <GlassCard style={styles.statCard}>
              <Ionicons name="medal" size={28} color={theme.colors.primary} />
              <Text style={styles.statLabel}>Current Level</Text>
              <Text style={styles.statValue}>{currentStudent.level}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Ionicons name="card" size={28} color={theme.colors.primary} />
              <Text style={styles.statLabel}>Membership</Text>
              <Text style={styles.statValue}>{currentStudent.membership}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={28} color={theme.colors.success} />
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{currentStudent.attendance.attended}/{currentStudent.attendance.totalClasses}</Text>
            </GlassCard>

            <GlassCard style={[styles.statCard, currentStudent.fee.status !== 'Paid' && { borderColor: theme.colors.warning }]}>
              <Ionicons name={currentStudent.fee.status === 'Paid' ? 'cash' : 'alert-circle'} size={28} color={currentStudent.fee.status === 'Paid' ? theme.colors.success : theme.colors.warning} />
              <Text style={styles.statLabel}>Fee Status</Text>
              <Text style={[styles.statValue, { color: currentStudent.fee.status === 'Paid' ? theme.colors.success : theme.colors.warning }]}>{currentStudent.fee.status}</Text>
            </GlassCard>
          </ScrollView>

          {/* Next Class Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See Schedule</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.classCard} hasGlow={true}>
            <View style={styles.classDateBox}>
              <Text style={styles.classMonth}>FEB</Text>
              <Text style={styles.classDay}>24</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.classTitle}>{currentStudent.level} Swimming Class</Text>
              <View style={styles.classDetRow}>
                <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.classDetText}>{currentStudent.schedule.time}</Text>
              </View>
              <View style={styles.classDetRow}>
                <Ionicons name="person-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.classDetText}>Coach Ahmed</Text>
              </View>
            </View>
          </GlassCard>

          {/* Recent Notifications */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
          </View>

          <View style={styles.notificationList}>
            {notifications.slice(0, 2).map((notif, index) => (
              <GlassCard key={index} style={[styles.notificationItem, !notif.read && styles.unreadNotif]}>
                <View style={[styles.notifIconBox, { backgroundColor: notif.type === 'holiday' ? 'rgba(239, 83, 80, 0.1)' : 'rgba(11, 246, 246, 0.1)' }]}>
                  <Ionicons
                    name={notif.type === 'holiday' ? 'calendar' : notif.type === 'fee' ? 'wallet' : 'information-circle'}
                    size={24}
                    color={notif.type === 'holiday' ? theme.colors.error : theme.colors.primary}
                  />
                </View>
                <View style={styles.notifContent}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifMsg} numberOfLines={2}>{notif.message}</Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </GlassCard>
            ))}
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
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  name: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: theme.colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 246, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.3)',
  },
  branchText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: theme.colors.primary,
    marginLeft: 6,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.background,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
  },
  statsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
  },
  statCard: {
    width: 140,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  statValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: theme.colors.primary,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    padding: theme.spacing.lg,
  },
  classDateBox: {
    backgroundColor: 'rgba(11, 246, 246, 0.15)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 70,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.3)',
  },
  classMonth: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: theme.colors.primary,
  },
  classDay: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: theme.colors.primary,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  classDetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  classDetText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  notificationList: {
    gap: theme.spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  unreadNotif: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    backgroundColor: 'rgba(11, 246, 246, 0.05)',
  },
  notifIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  notifMsg: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  }
});
