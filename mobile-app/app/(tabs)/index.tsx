import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function HomeScreen() {
  const [branchName, setBranchName] = useState('My Branch');
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState({ attended: 0, totalClasses: 0, freeClasses: 0, remaining: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedBranch = await AsyncStorage.getItem('selectedBranchName');
        if (storedBranch) setBranchName(storedBranch);

        const [profileRes, notifRes, scheduleRes, attRes] = await Promise.all([
          api.get('/student-app/profile').catch(() => ({ data: { success: false }})),
          api.get('/student-app/notifications').catch(() => ({ data: { success: false, data: [] }})),
          api.get('/student-app/schedule').catch(() => ({ data: { success: false, data: [] }})),
          api.get('/student-app/attendance').catch(() => ({ data: { success: false, data: [] }})),
        ]);

        if (profileRes.data.success) {
          const profileData = profileRes.data.data;
          const scheduleData = scheduleRes.data.success && scheduleRes.data.data.length > 0
              ? scheduleRes.data.data[0] : null;
          setStudent({ ...profileData, nextClass: scheduleData });
          if (!storedBranch && profileData.branch) {
              setBranchName(profileData.branch.name);
          }
        }

        if (attRes.data.success) {
          const records: any[] = attRes.data.data;
          const attended = records.filter(r => r.status === 'ATTENDED').length;
          // Get totalClasses and freeClasses directly from profile response data
          const total = profileRes.data.success ? (profileRes.data.data.totalClasses || 0) : 0;
          const free = profileRes.data.success ? (profileRes.data.data.freeClasses || 0) : 0;
          const effectiveTotal = total + free;
          setAttendance({ attended, totalClasses: total, freeClasses: free, remaining: Math.max(0, effectiveTotal - attended) });
        }

        if (notifRes.data.success) {
          setNotifications(notifRes.data.data);
        }
      } catch (error) {
        console.error('Dashboard DB fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);


  const unreadCount = notifications.filter(n => !(n as any).read).length;

  if (loading || !student) {
      return (
          <AppBackground style={styles.container}>
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <Text style={{color: 'white' }}>Loading Dashboard...</Text>
            </SafeAreaView>
          </AppBackground>
      );
  }

  return (
    <AppBackground style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Profile & Top Bar Row */}
          <View style={styles.headerSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageBorder}>
                <Ionicons name="person" size={50} color="rgba(255,255,255,0.3)" />
              </View>
            </View>

            <View style={styles.topBarRow}>
              <View style={[styles.topBarElement, styles.leftElement]}>
                <View style={styles.branchBadge}>
                  <Ionicons name="location" size={14} color={theme.colors.primary} />
                  <Text style={styles.branchText}>{branchName}</Text>
                </View>
              </View>

              <View style={styles.greetingCenter}>
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.name}>{student.name || 'Swimmer'}</Text>
              </View>

              <View style={[styles.topBarElement, styles.rightElement]}>
                <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notifications')}>
                  <Ionicons name="notifications-outline" size={26} color={theme.colors.primary} />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
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
              <View style={styles.statIconCircle}>
                <Ionicons name="medal" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Current Level</Text>
              <Text style={styles.statValue}>{student.level || '-'}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Ionicons name="card" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Membership</Text>
              <Text style={styles.statValue}>{student.packageType || '-'}</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{attendance.attended}/{attendance.totalClasses + attendance.freeClasses}</Text>
              {attendance.freeClasses > 0 && (
                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 9, color: '#10b981', marginTop: 2}}>+{attendance.freeClasses} free</Text>
              )}
            </GlassCard>
          </ScrollView>

          {/* Next Class Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            <TouchableOpacity onPress={() => router.push('/schedule')}>
              <Text style={styles.seeAll}>See Schedule</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.classCard}>
            {student.nextClass ? (
                <>
                <View style={styles.classDateBox}>
                  <Text style={styles.classMonth}>{new Date(student.nextClass.schedule?.date || new Date()).toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
                  <Text style={styles.classDay}>{new Date(student.nextClass.schedule?.date || new Date()).getDate()}</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{student.level} Swimming Class</Text>
                  <View style={styles.classDetRow}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.classDetText}>{student.nextClass.timeSlot}</Text>
                  </View>
                  <View style={styles.classDetRow}>
                    <Ionicons name="person-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.classDetText}>Coach {student.nextClass.schedule?.coach?.name || 'TBD'}</Text>
                  </View>
                </View>
                </>
            ) : (
                <View style={[styles.classInfo, { alignItems: 'center', paddingVertical: 10 }]}>
                  <Text style={[styles.classTitle, { marginBottom: 0, opacity: 0.7 }]}>No upcoming classes scheduled</Text>
                </View>
            )}
          </GlassCard>

          {/* Payment Status Alert */}
          {student.payments && student.payments[0] && (student.payments[0].status === 'PARTIAL' || student.payments[0].status === 'PENDING') ? (
            <GlassCard style={[styles.classCard, { borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', marginBottom: theme.spacing.xxl }]}>
              <View style={[styles.classDateBox, { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)' }]}>
                <Ionicons name="warning" size={24} color="#f59e0b" />
              </View>
              <View style={styles.classInfo}>
                <Text style={[styles.classTitle, { color: '#f59e0b' }]}>Payment Pending</Text>
                <Text style={[styles.classDetText, { color: '#fbbf24', marginTop: 2 }]}>
                  {student.payments[0].status === 'PARTIAL'
                    ? `Remaining: AED ${student.payments[0].pendingAmount?.toFixed(2) || '0.00'}`
                    : 'Fee payment is outstanding'}
                </Text>
                <Text style={[styles.classDetText, { color: 'rgba(255,255,255,0.5)', fontSize: 11 }]}>Contact academy to complete payment</Text>
              </View>
            </GlassCard>
          ) : student.payments && student.payments[0]?.status === 'PAID' ? (
            <GlassCard style={[styles.classCard, { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', marginBottom: theme.spacing.xxl }]}>
              <View style={[styles.classDateBox, { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View style={styles.classInfo}>
                <Text style={[styles.classTitle, { color: '#10b981' }]}>Fee Paid ✓</Text>
                <Text style={[styles.classDetText, { color: 'rgba(255,255,255,0.6)' }]}>AED {student.payments[0].totalAmount?.toFixed(2)}</Text>
              </View>
            </GlassCard>
          ) : null}


          {/* Recent Notifications */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
          </View>

          <View style={styles.notificationList}>
            {notifications.length === 0 ? (
                <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 10 }}>No new notifications</Text>
            ) : notifications.slice(0, 2).map((notif, index) => (
              <GlassCard key={index} style={styles.notificationItem}>
                <View style={styles.notifIconBox}>
                  <Ionicons
                    name={notif.type === 'Holiday' ? 'calendar' : notif.type === 'Fee' ? 'card' : 'information-circle'}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <Text style={styles.notifTitle}>{notif.title || 'Notification'}</Text>
                    <Text style={styles.notifDate}>{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ''}</Text>
                  </View>
                  <Text style={styles.notifMsg} numberOfLines={2}>{notif.message}</Text>
                </View>
                {!(notif as any).read && <View style={styles.unreadDot} />}
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
    padding: theme.spacing.lg,
    paddingBottom: 160,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  topBarElement: {
    position: 'absolute',
    top: 5,
  },
  leftElement: {
    left: 0,
  },
  rightElement: {
    right: 0,
  },
  greetingCenter: {
    alignItems: 'center',
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: '#0bf6f6',
  },
  branchText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
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
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#001e3f',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Poppins_700Bold',
  },
  profileImageContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: '#0bf6f6',
    padding: 2,
    marginBottom: theme.spacing.md,
    backgroundColor: '#00152b', // Required for Android shadowColor to be visible
    shadowColor: '#0bf6f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 20, // High elevation creates the ambient glow on Android 9+
  },
  profileImageBorder: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: -2,
  },
  name: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#ffffff',
  },
  statsContainer: {
    paddingRight: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    gap: 12,
  },
  statCard: {
    width: 110,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.2,
    borderColor: theme.colors.primary,
    borderRadius: 16,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 246, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.2)',
  },
  statLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginTop: 1,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: theme.colors.primary,
    opacity: 0.8,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.2,
    borderColor: theme.colors.primary,
    borderRadius: 16,
  },
  classDateBox: {
    backgroundColor: 'rgba(11, 246, 246, 0.12)',
    borderRadius: 12,
    padding: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 65,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.2)',
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
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  classDetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classDetText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  notificationList: {
    gap: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(11, 246, 246, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(11, 246, 246, 0.15)',
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
  notifDate: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#ffffff',
  },
  notifMsg: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    shadowColor: theme.colors.primary,
    shadowRadius: 6,
    shadowOpacity: 0.8,
    elevation: 8,
  }
});
