import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import Logo from '../components/Logo';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/login');
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <LinearGradient
            colors={[colors.background, colors.primary]}
            style={styles.container}
        >
            <Logo size={120} textVisible={false} />
            <Text style={styles.appName}>NSM</Text>
            <Text style={styles.tagline}>Dive Into Excellence</Text>

            {/* Decorative Wave Placeholder */}
            <View style={styles.waveContainer}>
                <View style={styles.wave1} />
                <View style={styles.wave2} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 42,
        fontFamily: 'Nunito_900Black',
        color: colors.textPrimary,
        marginTop: 20,
    },
    tagline: {
        fontSize: 20,
        fontFamily: 'Poppins_500Medium',
        color: colors.primaryDark,
        marginTop: 10,
    },
    waveContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 120,
        flexDirection: 'row',
    },
    wave1: {
        position: 'absolute',
        bottom: -60,
        width: '150%',
        height: 150,
        backgroundColor: 'rgba(2, 136, 209, 0.4)',
        borderRadius: 300,
        left: '-25%',
    },
    wave2: {
        position: 'absolute',
        bottom: -80,
        width: '150%',
        height: 150,
        backgroundColor: 'rgba(26, 35, 126, 0.6)',
        borderRadius: 300,
        left: '-10%',
    }
});
