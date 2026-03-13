import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { notifications } from '../../data/mockData';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

export default function NotificationsScreen() {

    const getIconData = (type) => {
        switch (type) {
            case 'holiday': return { icon: 'calendar', color: theme.colors.error, bg: 'rgba(239, 83, 80, 0.15)' };
            case 'fee': return { icon: 'wallet', color: theme.colors.warning, bg: 'rgba(255, 167, 38, 0.15)' };
            case 'class': return { icon: 'time', color: '#03A9F4', bg: 'rgba(3, 169, 244, 0.15)' };
            case 'assessment': return { icon: 'star', color: '#FFD54F', bg: 'rgba(255, 213, 79, 0.15)' };
            case 'offer': return { icon: 'gift', color: theme.colors.success, bg: 'rgba(102, 187, 106, 0.15)' };
            default: return { icon: 'information-circle', color: theme.colors.primary, bg: 'rgba(11, 246, 246, 0.15)' };
        }
    };

    const renderItem = ({ item }) => {
        const iconData = getIconData(item.type);
        const dateStr = new Date(item.date).toLocaleDateString();

        return (
            <GlassCard style={[styles.notificationCard, !item.read && styles.unreadCard]}>
                <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
                    <Ionicons name={iconData.icon} size={24} color={iconData.color} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                        <Text style={styles.date}>{dateStr}</Text>
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                </View>
                {!item.read && <View style={styles.unreadIndicator} />}
            </GlassCard>
        );
    };

    return (
        <AppBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
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
        padding: theme.spacing.xl,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Nunito_900Black',
        color: theme.colors.textPrimary,
        textShadowColor: 'rgba(11, 246, 246, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    listContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: 100,
        gap: theme.spacing.md,
    },
    notificationCard: {
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    unreadCard: {
        borderLeftColor: theme.colors.primary,
        backgroundColor: 'rgba(11, 246, 246, 0.05)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    title: {
        flex: 1,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: theme.colors.textPrimary,
    },
    unreadTitle: {
        fontFamily: 'Poppins_700Bold',
        color: theme.colors.primary,
    },
    date: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginLeft: 8,
    },
    message: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        marginLeft: 12,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    }
});
