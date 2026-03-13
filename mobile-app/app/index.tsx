import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';
import AppBackground from '../components/ui/AppBackground';
import { theme } from '../constants/theme';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/login');
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <AppBackground style={styles.container}>
            <View style={styles.centerContent}>
                <Logo size={140} textVisible={false} />
            </View>
            <Text style={styles.tagline}>INHALE CONFIDENCE EXHALE FEAR</Text>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagline: {
        fontSize: 18,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 50,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    }
});

