import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
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

export default function ContactUsScreen() {
    const handleCall = () => Linking.openURL('tel:+971501234567');
    const handleWhatsApp = () => Linking.openURL('whatsapp://send?phone=+971501234567');

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Contact Us</Text>
                        <Text style={styles.subtitle}>We're here to help you make a splash!</Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={handleCall}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="call" size={24} color="#000" />
                            <Text style={styles.callButtonText}>Call Us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.whatsappButton}
                            onPress={handleWhatsApp}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="logo-whatsapp" size={24} color={theme.colors.primary} />
                            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email Support */}
                    <TouchableOpacity activeOpacity={0.7}>
                        <GlassCard style={styles.emailCard}>
                            <View style={styles.emailIconBox}>
                                <Ionicons name="mail" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.emailContent}>
                                <Text style={styles.emailLabel}>Email Support</Text>
                                <Text style={styles.emailValue}>info@nsm.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                        </GlassCard>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Our Locations</Text>

                    {/* Locations */}
                    {branches.map((branch) => (
                        <GlassCard key={branch.id} style={styles.locationCard}>
                            <View style={styles.locationHeader}>
                                <Ionicons name="location" size={22} color={theme.colors.primary} />
                                <Text style={styles.locationTitle}>{branch.name}</Text>
                            </View>

                            <Text style={styles.locationAddress}>{branch.address}</Text>

                            <View style={styles.locationDetailItem}>
                                <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.locationDetailText}>{branch.phone}</Text>
                            </View>

                            <View style={styles.locationDetailItem}>
                                <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.locationDetailText}>{branch.hours}</Text>
                            </View>
                        </GlassCard>
                    ))}

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
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Nunito_900Black',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: theme.colors.textSecondary,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        // Boosted Glow effect for Android
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 20,
    },
    callButtonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#000',
    },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    whatsappButtonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#fff',
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 15, 31, 0.1)',
        marginBottom: 30,
        borderWidth: 1.5,
        borderColor: '#c5ccd1ff',
        borderRadius: 16,
    },
    emailIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
    },
    emailContent: {
        flex: 1,
    },
    emailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    emailValue: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
        marginBottom: 20,
    },
    locationCard: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: 'rgba(0, 15, 31, 0.1)',
        borderWidth: 1.5,
        borderColor: '#c5ccd1ff',
        borderRadius: 16,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    locationTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        color: '#fff',
    },
    locationAddress: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 15,
        lineHeight: 20,
    },
    locationDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    locationDetailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    }
});
