import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Logo({ size = 120, textVisible = false }) {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/nsm_logo_shark.png')} 
                style={{ width: size, height: size, resizeMode: 'contain' }} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
