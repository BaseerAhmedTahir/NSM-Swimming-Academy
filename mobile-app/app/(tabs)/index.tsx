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
    <AppBackground style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top Bar: Location & Notifications */}
          <View style={styles.topBar}>
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

          {/* Centered Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageBorder}>
                <Ionicons name="person" size={50} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{currentStudent.name}</Text>
          </View>

          {/* Quick Stats Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          >
            <GlassCard style={styles.statCard} hasGlow={true}>
              <View style={styles.statIconCircle}>
                <Ionicons name="medal" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Current Level</Text>
              <Text style={styles.statValue}>{currentStudent.level}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Ionicons name="card" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Membership</Text>
              <Text style={styles.statValue}>{currentStudent.membership}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{currentStudent.attendance.attended}/{currentStudent.attendance.totalClasses}</Text>
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
              <GlassCard key={index} style={styles.notificationItem}>
                <View style={styles.notifIconBox}>
                  <Ionicons
                    name={notif.type === 'holiday' ? 'calendar' : notif.type === 'fee' ? 'card' : 'information-circle'}
                    size={22}
                    color={theme.colors.primary}
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
    paddingBottom: 120, 
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
  branchText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
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
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#001e3f',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Poppins_700Bold',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: 4,
    marginBottom: theme.spacing.md,
  },
  profileImageBorder: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: theme.colors.textPrimary,
  },
  statsContainer: {
    paddingRight: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
    gap: 16,
  },
  statCard: {
    width: 125,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 246, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.2)',
  },
  statLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginTop: 2,
    textAlign: 'center',
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
    opacity: 0.8,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  classDateBox: {
    backgroundColor: 'rgba(11, 246, 246, 0.12)',
    borderRadius: 18,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 75,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.2)',
  },
  classMonth: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: theme.colors.primary,
    opacity: 0.8,
  },
  classDay: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: theme.colors.primary,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 8,
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
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 246, 246, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.15)',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  notifMsg: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowRadius: 4,
    shadowOpacity: 0.5,
  }
});
