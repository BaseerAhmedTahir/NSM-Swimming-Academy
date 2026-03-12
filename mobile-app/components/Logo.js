import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function Logo({ size = 80, textVisible = true }) {
    return (
        <View style={styles.container}>
            <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
                <Ionicons name="water" size={size * 0.5} color={colors.card} />
                <Text style={[styles.logoText, { fontSize: size * 0.25 }]}>NSM</Text>
            </View>
            {textVisible && (
                <Text style={styles.brandText}>NSM Swimming Academy</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        backgroundColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    logoText: {
        color: colors.card,
        fontWeight: '900',
        fontFamily: 'Nunito_900Black',
        marginTop: -2,
    },
    brandText: {
        marginTop: 12,
        fontSize: 22,
        fontFamily: 'Nunito_800ExtraBold',
        color: colors.textPrimary,
        textAlign: 'center',
    },
});
