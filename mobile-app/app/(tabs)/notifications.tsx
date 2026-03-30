import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';

export default function NotificationsScreen() {
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get('/student-app/notifications');
                if (res.data.success) {
                    setNotifs(res.data.data);
                }
            } catch (error) {
                console.error("Fetch notifications error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, []);

    const handlePress = (id: any) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        // You would typically hit a markAsRead endpoint here too
    };

    const handleRemove = (id: any) => {
        setNotifs(prev => prev.filter(n => n.id !== id));
    };

    const getIconData = (type: string) => {
        switch (type) {
            case 'holiday': return { icon: 'calendar-outline' };
            case 'fee': return { icon: 'card-outline' };
            case 'class': return { icon: 'information-circle-outline' };
            case 'assessment': return { icon: 'star-outline' };
            case 'offer': return { icon: 'gift-outline' };
            default: return { icon: 'notifications-outline' };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const iconData = getIconData(item.type?.toLowerCase() || 'info');
        const d = item.createdAt ? new Date(item.createdAt) : new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        return (
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => handlePress(item.id)}
                style={{ marginBottom: 10 }}
            >
                <GlassCard style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
                    <View style={styles.iconBox}>
                        <Ionicons name={iconData.icon as any} size={24} color="#0bf6f6" />
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.headerRow}>
                            <Text style={[styles.title, !item.isRead && styles.unreadTitle]} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.date}>{dateStr}</Text>
                        </View>
                        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    </View>
                    {!item.isRead && <View style={styles.unreadDot} />}
                    <TouchableOpacity 
                        style={styles.deleteBtn}
                        onPress={() => handleRemove(item.id)}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                        <Ionicons name="close" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                </GlassCard>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="rgba(11, 246, 246, 0.4)" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>You're all caught up with your alerts!</Text>
        </View>
    );

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <Text style={styles.subtitle}>Stay updated with your progress</Text>
                </View>
                <FlatList
                    data={notifs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
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
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 160,
    },
    notificationCard: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 15, 31, 0.1)', // More transparent
        borderWidth: 1.2,
        borderColor: '#0bf6f6',
        borderRadius: 16,
    },
    unreadCard: {
        backgroundColor: 'rgba(0, 15, 31, 0.3)', // Slightly darker for unread
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24, // Perfect circle
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(11, 246, 246, 0.4)',
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
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
        color: '#ffffff',
    },
    unreadTitle: {
        color: '#ffffff',
    },
    date: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#a0aab2',
        marginLeft: 8,
    },
    message: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#a0aab2',
        lineHeight: 20,
        marginTop: 4,
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
    },
    deleteBtn: {
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: '#ffffff',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#a0aab2',
        textAlign: 'center',
    }
});
