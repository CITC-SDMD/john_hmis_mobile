import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from '../../app/dashboard';    

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerLayout;
