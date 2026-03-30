import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function PrimaryButton({ title, onPress, style, textStyle }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 22, // Slicker rounded corners
        paddingVertical: 18,
        paddingHorizontal: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        // Extreme Modern Glow
        borderWidth: 1,
        borderColor: '#ffffff55',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 15,
    },
    text: {
        color: '#002a2a', // Deep contrast text for aquatic button
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        letterSpacing: 0.5,
    }
});
