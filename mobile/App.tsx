import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
});

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = '';
                
                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Contacts') {
                  iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#7c3aed', // Purple color from your web app
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: '#7c3aed', // Purple color
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}