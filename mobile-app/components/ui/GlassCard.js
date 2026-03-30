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
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        borderWidth: 1.2,
        borderColor: theme.colors.primary,
        padding: theme.spacing.lg,
        overflow: 'visible',
    },
    glow: {
        borderColor: '#0bf6f6',
    }
});
