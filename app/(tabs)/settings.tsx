import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Bell, Shield, Download, Trash2, CircleHelp as HelpCircle, Moon, Globe, ChevronRight } from 'lucide-react-native';

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataExport, setDataExport] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your health data will be exported as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') }
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your logged data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Deleting data...') 
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <ChevronRight size={20} color="#6B7280" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingGroup}>
            <SettingItem
              icon={<Bell size={20} color="#3B82F6" />}
              title="Daily Reminders"
              subtitle="Get reminded to log your daily symptoms"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  thumbColor={notifications ? '#3B82F6' : '#6B7280'}
                />
              }
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingGroup}>
            <SettingItem
              icon={<Moon size={20} color="#3B82F6" />}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  thumbColor={darkMode ? '#3B82F6' : '#6B7280'}
                />
              }
            />
            <SettingItem
              icon={<Globe size={20} color="#3B82F6" />}
              title="Language"
              subtitle="English (US)"
              onPress={() => Alert.alert('Language', 'Language settings coming soon!')}
            />
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.settingGroup}>
            <SettingItem
              icon={<Shield size={20} color="#3B82F6" />}
              title="Privacy Policy"
              subtitle="Learn how we protect your data"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy details would be shown here.')}
            />
            <SettingItem
              icon={<Download size={20} color="#3B82F6" />}
              title="Export Data"
              subtitle="Download your health data"
              onPress={handleExportData}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.settingGroup}>
            <SettingItem
              icon={<Trash2 size={20} color="#EF4444" />}
              title="Delete All Data"
              subtitle="Permanently remove all logged data"
              onPress={handleDeleteData}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingGroup}>
            <SettingItem
              icon={<HelpCircle size={20} color="#3B82F6" />}
              title="Help & Support"
              subtitle="Get help with using the app"
              onPress={() => Alert.alert('Support', 'Support resources would be shown here.')}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>IBS Tracker</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A comprehensive tool for tracking IBS symptoms, food intake, and overall wellness.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  bottomSpacing: {
    height: 32,
  },
});