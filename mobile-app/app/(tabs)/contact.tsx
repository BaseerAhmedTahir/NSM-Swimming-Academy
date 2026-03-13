import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import AppBackground from '../../components/ui/AppBackground';
import GlassCard from '../../components/ui/GlassCard';

const branches = [
    {
        id: 1,
        name: 'Dubai Head Office',
        address: 'Fitness First, Al Barsha Mall, Dubai, UAE',
        phone: '+971 50 123 4567',
        hours: 'Sun-Thu: 8am - 8pm | Fri-Sat: 9am - 6pm'
    },
    {
        id: 2,
        name: 'Sharjah Branch',
        address: 'Sharjah Wanderers Sports Club, Sharjah, UAE',
        phone: '+971 50 123 4568',
        hours: 'Sun-Thu: 9am - 9pm | Fri-Sat: 10am - 7pm'
    },
    {
        id: 3,
        name: 'Abu Dhabi Branch',
        address: 'Zayed Sports City, Abu Dhabi, UAE',
        phone: '+971 50 123 4569',
        hours: 'Sun-Thu: 8am - 8pm | Fri-Sat: 9am - 6pm'
    }
];

export default function ContactScreen() {
    const [activeTab, setActiveTab] = React.useState(0);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleWhatsApp = (phone: string) => {
        Linking.openURL(`whatsapp://send?phone=${phone}`);
    };

    const handleMap = (address: string) => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
    };

    const currentBranch = branches[activeTab];

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Contact Us</Text>
                        <Text style={styles.subtitle}>We're here to help you make a splash!</Text>
                    </View>

                    {/* Branch Selection Tabs */}
                    <View style={styles.tabContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                            {branches.map((branch, index) => (
                                <TouchableOpacity 
                                    key={branch.id} 
                                    onPress={() => setActiveTab(index)}
                                    style={[styles.tabButton, activeTab === index && styles.activeTabButton]}
                                >
                                    <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                                        {branch.name.split(' ')[0]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Branch Details Card */}
                    <GlassCard style={styles.infoCard}>
                        <View style={styles.branchHeader}>
                            <View style={styles.branchIconBox}>
                                <Ionicons name="business" size={24} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.branchDetailName}>{currentBranch.name}</Text>
                                <Text style={styles.branchStatus}>Open Now</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.contactItem} onPress={() => handleMap(currentBranch.address)}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.contactText}>{currentBranch.address}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={() => handleCall(currentBranch.phone)}>
                            <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.contactText}>{currentBranch.phone}</Text>
                        </TouchableOpacity>

                        <View style={styles.contactItem}>
                            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.contactText}>{currentBranch.hours}</Text>
                        </View>

                        <View style={styles.actionGrid}>
                            <TouchableOpacity style={styles.gridBtn} onPress={() => handleCall(currentBranch.phone)}>
                                <View style={[styles.gridIconBox, { backgroundColor: 'rgba(11, 246, 246, 0.1)' }]}>
                                    <Ionicons name="call" size={22} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.gridBtnText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gridBtn} onPress={() => handleWhatsApp(currentBranch.phone)}>
                                <View style={[styles.gridIconBox, { backgroundColor: 'rgba(37, 211, 102, 0.1)' }]}>
                                    <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                                </View>
                                <Text style={styles.gridBtnText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gridBtn} onPress={() => handleMap(currentBranch.address)}>
                                <View style={[styles.gridIconBox, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                                    <Ionicons name="map" size={22} color="#fff" />
                                </View>
                                <Text style={styles.gridBtnText}>Map</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>

                    {/* Map Placeholder */}
                    <View style={styles.mapSection}>
                        <GlassCard style={styles.mapCard}>
                            <View style={styles.mapPlaceholder}>
                                <View style={styles.mapOverlay}>
                                    <View style={styles.mapMarker}>
                                        <Ionicons name="location" size={30} color={theme.colors.primary} />
                                        <View style={styles.markerShadow} />
                                    </View>
                                    <Text style={styles.mapLabel}>Find us on the map</Text>
                                </View>
                            </View>
                        </GlassCard>
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
    header: {
        marginBottom: 25,
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
    tabContainer: {
        marginBottom: 25,
    },
    tabScroll: {
        gap: 12,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeTabButton: {
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        borderColor: theme.colors.primary,
    },
    tabText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    infoCard: {
        padding: 16,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    branchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    branchIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
    },
    branchDetailName: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
        marginBottom: 2,
    },
    branchStatus: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
        color: theme.colors.success,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    contactText: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: theme.colors.textSecondary,
        lineHeight: 18,
    },
    actionGrid: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 12,
    },
    gridBtn: {
        flex: 1,
        alignItems: 'center',
    },
    gridIconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    gridBtnText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    mapSection: {
        marginBottom: 20,
    },
    mapCard: {
        padding: 0,
        height: 200,
        overflow: 'hidden',
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: 'rgba(11, 246, 246, 0.05)',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    mapMarker: {
        alignItems: 'center',
    },
    markerShadow: {
        width: 10,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        marginTop: -4,
    },
    mapLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.textPrimary,
        marginTop: 12,
        opacity: 0.8,
    }
});
