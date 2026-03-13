import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function SecondaryButton({ title, onPress, style, textStyle, icon }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {icon}
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm
    },
    text: {
        color: theme.colors.primary,
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
    }
});
