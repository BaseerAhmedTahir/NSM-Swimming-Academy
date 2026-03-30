import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Logo({ size = 120, textVisible = false }) {
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <View style={[
                styles.boundaryRing, 
                { 
                    width: size, 
                    height: size, 
                    borderRadius: size / 2,
                    borderWidth: 1.5
                }
            ]} />
            <Image 
                source={require('../assets/images/nsm_logo_shark.png')} 
                style={{ width: size - 4, height: size - 4, resizeMode: 'contain' }} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    boundaryRing: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: '#0bf6f6',
    }
});
