import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

export default function AppBackground({ children, style }) {
    return (
        <ImageBackground 
            source={require('../../assets/images/bg.png')} 
            style={[styles.background, style]}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                {children}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 30, 63, 0.4)', // subtle overlay to ensure contrast
    }
});
