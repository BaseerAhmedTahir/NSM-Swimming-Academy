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
    const handleCall = (phone) => {
        console.log(`Calling ${phone}`);
    };

    const handleEmail = () => {
        console.log('Sending email to info@nsm.com');
    };

    const handleSocial = (platform) => {
        console.log(`Opening ${platform}`);
    };

    return (
        <AppBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Contact Us</Text>
                        <Text style={styles.subtitle}>We're here to help you make a splash!</Text>
                    </View>

                    {/* Primary Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleCall('+971501234567')}>
                            <GlassCard style={styles.actionBtn}>
                                <Ionicons name="call" size={24} color={theme.colors.primary} />
                                <Text style={styles.actionText}>Call Us</Text>
                            </GlassCard>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleCall('+971501234567')}>
                            <GlassCard style={[styles.actionBtn, styles.whatsappBtn]}>
                                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                                <Text style={[styles.actionText, { color: '#25D366' }]}>WhatsApp</Text>
                            </GlassCard>
                        </TouchableOpacity>
                    </View>

                    {/* Email Support */}
                    <TouchableOpacity onPress={handleEmail}>
                        <GlassCard style={styles.emailCard}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="mail" size={20} color={theme.colors.primary} />
                            </View>
                            <View style={styles.emailInfo}>
                                <Text style={styles.emailLabel}>Email Support</Text>
                                <Text style={styles.emailAddress}>info@nsm.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </GlassCard>
                    </TouchableOpacity>

                    {/* Branch Locations */}
                    <Text style={styles.sectionTitle}>Our Locations</Text>
                    <View style={styles.locationsContainer}>
                        {branches.map(branch => (
                            <GlassCard key={branch.id} style={styles.branchCard}>
                                <View style={styles.branchHeader}>
                                    <Ionicons name="location" size={20} color={theme.colors.error} />
                                    <Text style={styles.branchName}>{branch.name}</Text>
                                </View>
                                <View style={styles.branchDetail}>
                                    <Text style={styles.detailText}>{branch.address}</Text>
                                </View>
                                <View style={styles.branchDetail}>
                                    <Ionicons name="call-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                                    <Text style={styles.detailText}>{branch.phone}</Text>
                                </View>
                                <View style={styles.branchDetail}>
                                    <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                                    <Text style={styles.detailText}>{branch.hours}</Text>
                                </View>
                            </GlassCard>
                        ))}
                    </View>

                    {/* Social Media */}
                    <View style={styles.socialSection}>
                        <Text style={styles.socialTitle}>Follow Us</Text>
                        <View style={styles.socialIconsRow}>
                            <TouchableOpacity onPress={() => handleSocial('Instagram')}>
                                <View style={styles.socialButton}>
                                    <Ionicons name="logo-instagram" size={28} color="#E1306C" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSocial('Facebook')}>
                                <View style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSocial('YouTube')}>
                                <View style={styles.socialButton}>
                                    <Ionicons name="logo-youtube" size={28} color="#FF0000" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Map Placeholder */}
                    <GlassCard style={styles.mapContainer}>
                        <View style={styles.mapPlaceholder}>
                            <Ionicons name="map" size={40} color={theme.colors.primary} />
                            <Text style={styles.mapText}>Map Placeholder for Prototype</Text>
                        </View>
                    </GlassCard>

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
        paddingBottom: 100,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Nunito_900Black',
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textShadowColor: 'rgba(11, 246, 246, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: theme.colors.textSecondary,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: theme.spacing.xl,
    },
    actionBtn: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        borderColor: 'rgba(11, 246, 246, 0.3)',
        borderWidth: 1,
    },
    whatsappBtn: {
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        borderColor: 'rgba(37, 211, 102, 0.3)',
    },
    actionText: {
        color: theme.colors.primary,
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        marginLeft: 8,
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        marginBottom: 30,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(11, 246, 246, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.3)',
    },
    emailInfo: {
        flex: 1,
    },
    emailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    emailAddress: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: theme.colors.textPrimary,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
    },
    locationsContainer: {
        gap: theme.spacing.md,
        marginBottom: 30,
    },
    branchCard: {
        padding: theme.spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    branchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    branchName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 17,
        color: theme.colors.textPrimary,
        marginLeft: 8,
    },
    branchDetail: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        paddingLeft: 28,
    },
    detailText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    socialSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    socialTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: theme.colors.textPrimary,
        marginBottom: 16,
    },
    socialIconsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        height: 200,
        overflow: 'hidden',
        padding: 0,
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: 'rgba(11, 246, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.primary,
        marginTop: 10,
    }
});
