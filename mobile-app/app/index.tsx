import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';
import AppBackground from '../components/ui/AppBackground';
import { theme } from '../constants/theme';
import * as storage from '../lib/storage';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const token = await storage.getItem('userToken');
                if (token) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/branch-selection');
                }
            } catch (err) {
                router.replace('/branch-selection');
            }
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <AppBackground style={styles.container}>
            <View style={styles.centerContent}>
                <Logo size={180} textVisible={false} />
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
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 80,
        textAlign: 'center',
        paddingHorizontal: 20,
        // Optional subtle glow for text
        textShadowColor: 'rgba(11, 246, 246, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    }
});

