import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { notifications } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

export default function NotificationsScreen() {

    const getIconData = (type: string) => {
        switch (type) {
            case 'holiday': return { icon: 'calendar', color: theme.colors.error, bg: 'rgba(239, 83, 80, 0.1)' };
            case 'fee': return { icon: 'wallet', color: theme.colors.warning, bg: 'rgba(255, 167, 38, 0.1)' };
            case 'class': return { icon: 'time', color: '#03A9F4', bg: 'rgba(3, 169, 244, 0.1)' };
            case 'assessment': return { icon: 'star', color: '#FFD54F', bg: 'rgba(255, 213, 79, 0.1)' };
            case 'offer': return { icon: 'gift', color: theme.colors.success, bg: 'rgba(102, 187, 106, 0.1)' };
            default: return { icon: 'information-circle', color: theme.colors.primary, bg: 'rgba(11, 246, 246, 0.1)' };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const iconData = getIconData(item.type);
        const dateStr = new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' });

        return (
            <GlassCard style={[styles.notificationCard, !item.read && styles.unreadCard]}>
                <View style={[styles.iconBox, { backgroundColor: iconData.bg }]}>
                    <Ionicons name={iconData.icon as any} size={22} color={iconData.color} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                        <Text style={styles.date}>{dateStr}</Text>
                    </View>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </GlassCard>
        );
    };

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <Text style={styles.subtitle}>Stay updated with your progress</Text>
                </View>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Nunito_900Black',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: theme.colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 160,
        gap: 10,
    },
    notificationCard: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    unreadCard: {
        backgroundColor: 'rgba(11, 246, 246, 0.06)',
        borderColor: 'rgba(11, 246, 246, 0.15)',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.textPrimary,
    },
    unreadTitle: {
        color: theme.colors.primary,
    },
    date: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        marginLeft: 8,
    },
    message: {
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
        marginLeft: 12,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2,
    }
});
