import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

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
        // Mock call action
        console.log(`Calling ${phone}`);
    };

    const handleEmail = () => {
        // Mock email action
        console.log('Sending email to info@nsm.com');
    };

    const handleSocial = (platform) => {
        // Mock social media action
        console.log(`Opening ${platform}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Contact Us</Text>
                    <Text style={styles.subtitle}>We're here to help you make a splash!</Text>
                </View>

                {/* Primary Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primaryDark }]} onPress={() => handleCall('+971501234567')}>
                        <Ionicons name="call" size={24} color={colors.card} />
                        <Text style={styles.actionText}>Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366' }]} onPress={() => handleCall('+971501234567')}>
                        <Ionicons name="logo-whatsapp" size={24} color={colors.card} />
                        <Text style={styles.actionText}>WhatsApp</Text>
                    </TouchableOpacity>
                </View>

                {/* Email Support */}
                <TouchableOpacity style={styles.emailCard} onPress={handleEmail}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="mail" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.emailInfo}>
                        <Text style={styles.emailLabel}>Email Support</Text>
                        <Text style={styles.emailAddress}>info@nsm.com</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Branch Locations */}
                <Text style={styles.sectionTitle}>Our Locations</Text>
                <View style={styles.locationsContainer}>
                    {branches.map(branch => (
                        <View key={branch.id} style={styles.branchCard}>
                            <View style={styles.branchHeader}>
                                <Ionicons name="location" size={20} color={colors.error} />
                                <Text style={styles.branchName}>{branch.name}</Text>
                            </View>
                            <View style={styles.branchDetail}>
                                <Text style={styles.detailText}>{branch.address}</Text>
                            </View>
                            <View style={styles.branchDetail}>
                                <Ionicons name="call-outline" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                <Text style={styles.detailText}>{branch.phone}</Text>
                            </View>
                            <View style={styles.branchDetail}>
                                <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                                <Text style={styles.detailText}>{branch.hours}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Social Media */}
                <View style={styles.socialSection}>
                    <Text style={styles.socialTitle}>Follow Us</Text>
                    <View style={styles.socialIconsRow}>
                        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocial('Instagram')}>
                            <Ionicons name="logo-instagram" size={28} color="#E1306C" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocial('Facebook')}>
                            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocial('YouTube')}>
                            <Ionicons name="logo-youtube" size={28} color="#FF0000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Map Placeholder */}
                <View style={styles.mapContainer}>
                    <View style={styles.mapPlaceholder}>
                        <Ionicons name="map" size={40} color={colors.primary} />
                        <Text style={styles.mapText}>Map Placeholder for Prototype</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Nunito_900Black',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: colors.textSecondary,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    actionBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    actionText: {
        color: colors.card,
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        marginLeft: 8,
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(79, 195, 247, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emailInfo: {
        flex: 1,
    },
    emailLabel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: colors.textSecondary,
    },
    emailAddress: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: colors.textPrimary,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Nunito_800ExtraBold',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    locationsContainer: {
        gap: 16,
        marginBottom: 30,
    },
    branchCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    branchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    branchName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: colors.textPrimary,
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
        fontSize: 13,
        color: colors.textSecondary,
        flex: 1,
    },
    socialSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    socialTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: colors.textPrimary,
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
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.card,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: colors.primaryDark,
        marginTop: 10,
    }
});
