import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function GlassCard({ children, style, hasGlow = false }) {
    return (
        <View style={[
            styles.card, 
            hasGlow && styles.glow,
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly more opaque for better contrast
        borderRadius: theme.radius.xl,
        borderWidth: 1.2,
        borderColor: 'rgba(11, 246, 246, 0.15)',
        padding: theme.spacing.lg,
        overflow: 'hidden',
    },
    glow: {
        borderColor: 'rgba(11, 246, 246, 0.5)', // Stronger border instead of elevation
        borderWidth: 1.5,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    }
});
