import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import AppBackground from '../components/ui/AppBackground';
import GlassCard from '../components/ui/GlassCard';

export default function PoliciesScreen() {
    const router = useRouter();

    return (
        <AppBackground style={styles.container}>
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Academy Policies</Text>
                    <View style={{ width: 40 }} /> {/* Placeholder for alignment */}
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <GlassCard style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Pool Rules & Policies</Text>
                        </View>
                        
                        <View style={styles.bulletList}>
                            <BulletItem text="No running or pushing around the pool area." />
                            <BulletItem text="Do not enter the pool without the coach’s permission." />
                            <BulletItem text="Proper swimwear is required at all times." />
                            <BulletItem text="Swimming cap and goggles are compulsory." />
                            <BulletItem text="Do not enter the pool if you have any skin infection or illness. Please consult a doctor first. NSM will not be responsible in such cases." />
                            <BulletItem text="Inside the water, students are our responsibility. Outside the pool, parents/guardians are responsible for their child’s safety. NSM will not be responsible for any incidents outside the pool." />
                            <BulletItem text="Please arrive 10 minutes before your class. Late arrivals may miss their session." />
                            <BulletItem text="Inform at least 12 hours in advance if you are unable to attend. Late notice or no-show will be counted as a class." />
                            <BulletItem text="Avoid interrupting the class during sessions." />
                            <BulletItem text="Keep valuables at home. Management is not responsible for any loss or damage." />
                            <BulletItem text="Respect coaches, staff, and fellow swimmers at all times." />
                        </View>
                    </GlassCard>

                    <GlassCard style={[styles.card, { marginTop: 20 }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Membership Policies</Text>
                        </View>
                        
                        <View style={styles.bulletList}>
                            <BulletItem text="No Refund Policy" isBold />
                            <BulletItem text="Extension of the Membership for 7/15/30 days will be charged 30/60/120 AED" />
                            <BulletItem text="Absent Class should be rescheduled within the activation time period of membership" />
                            <BulletItem text="Group class will be 4-5 people" />
                            <BulletItem text="All Prices are for Group class" />
                            <BulletItem text="All prices are exclusive of 5% VAT" />
                        </View>
                    </GlassCard>

                </ScrollView>
            </SafeAreaView>
        </AppBackground>
    );
}

const BulletItem = ({ text, isBold = false }: { text: string, isBold?: boolean }) => (
    <View style={styles.bulletItem}>
        <View style={styles.bulletPoint} />
        <Text style={[styles.bulletText, isBold && styles.bulletTextBold]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        padding: 20,
        backgroundColor: 'rgba(0, 15, 31, 0.2)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.3)',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
    bulletList: {
        gap: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginTop: 7,
        marginRight: 10,
    },
    bulletText: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#a0aab2',
        lineHeight: 20,
    },
    bulletTextBold: {
        fontFamily: 'Poppins_700Bold',
        color: '#fff',
    }
});
