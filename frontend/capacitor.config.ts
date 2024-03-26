import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.app',
    appName: 'frontend',
    webDir: 'dist/frontend/browser',
    server: {
        cleartext: true
    }
};

export default config;
