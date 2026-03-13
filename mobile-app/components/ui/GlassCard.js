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
        backgroundColor: theme.colors.surface80,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        padding: theme.spacing.lg,
        overflow: 'hidden',
    },
    glow: {
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    }
});
