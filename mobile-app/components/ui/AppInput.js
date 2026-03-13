import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function AppInput({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, style }) {
    return (
        <View style={[styles.container, style]}>
            {icon && (
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color={theme.colors.primary} />
                </View>
            )}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(13, 27, 42, 0.6)', // Consistent glass look
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: 'rgba(11, 246, 246, 0.2)',
        height: 56,
        paddingHorizontal: theme.spacing.lg,
    },
    iconContainer: {
        marginRight: theme.spacing.md,
    },
    input: {
        flex: 1,
        color: theme.colors.textPrimary,
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
    }
});
