import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { notifications } from '../../data/mockData';

export default function NotificationsScreen() {

    const getIconData = (type) => {
        switch (type) {
            case 'holiday': return { icon: 'calendar', color: colors.error, bg: 'rgba(239, 83, 80, 0.1)' };
            case 'fee': return { icon: 'wallet', color: colors.warning, bg: 'rgba(255, 167, 38, 0.1)' };
            case 'class': return { icon: 'time', color: colors.primaryDark, bg: 'rgba(2, 136, 209, 0.1)' };
            case 'assessment': return { icon: 'star', color: colors.accentYellow, bg: 'rgba(255, 213, 79, 0.2)' };
            case 'offer': return { icon: 'gift', color: colors.success, bg: 'rgba(102, 187, 106, 0.1)' };
            default: return { icon: 'information-circle', color: colors.primary, bg: 'rgba(79, 195, 247, 0.1)' };
        }
    };

    const renderItem = ({ item }) => {
        const iconData = getIconData(item.type);
        const dateStr = new Date(item.date).toLocaleDateString();

        return (
            <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
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
            </View>
        );
    };

    return (
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 16,
    },
    notificationCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    unreadCard: {
        borderLeftColor: colors.primary,
        backgroundColor: 'rgba(79, 195, 247, 0.03)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
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
        fontSize: 16,
        color: colors.textPrimary,
    },
    unreadTitle: {
        fontFamily: 'Poppins_700Bold',
    },
    date: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    message: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginLeft: 12,
    }
});
