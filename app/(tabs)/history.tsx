import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

interface LogEntry {
  date: string;
  mood: number;
  symptoms: string[];
  poopCount: number;
  waterIntake: number;
  exercised: boolean;
}

const mockData: LogEntry[] = [
  {
    date: '2024-01-15',
    mood: 7,
    symptoms: ['Bloating', 'Gas'],
    poopCount: 2,
    waterIntake: 6,
    exercised: true,
  },
  {
    date: '2024-01-14',
    mood: 5,
    symptoms: ['Cramping', 'Diarrhea', 'Anxiety'],
    poopCount: 4,
    waterIntake: 8,
    exercised: false,
  },
  {
    date: '2024-01-13',
    mood: 8,
    symptoms: [],
    poopCount: 1,
    waterIntake: 7,
    exercised: true,
  },
];

export default function HistoryTab() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getCurrentMonth = () => {
    return selectedMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10B981';
    if (mood >= 6) return '#F59E0B';
    if (mood >= 4) return '#F97316';
    return '#EF4444';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <View style={styles.monthNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <ChevronLeft size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{getCurrentMonth()}</Text>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Mood</Text>
            <Text style={styles.summaryValue}>6.7</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Days Logged</Text>
            <Text style={styles.summaryValue}>15</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Water</Text>
            <Text style={styles.summaryValue}>7.2</Text>
          </View>
        </View>

        <View style={styles.entriesContainer}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {mockData.map((entry, index) => (
            <TouchableOpacity key={index} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDate}>
                  <CalendarIcon size={16} color="#6B7280" />
                  <Text style={styles.entryDateText}>{formatDate(entry.date)}</Text>
                </View>
                <View style={[
                  styles.moodIndicator,
                  { backgroundColor: getMoodColor(entry.mood) }
                ]}>
                  <Text style={styles.moodText}>{entry.mood}</Text>
                </View>
              </View>
              
              <View style={styles.entryStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Symptoms</Text>
                  <Text style={styles.statValue}>
                    {entry.symptoms.length === 0 ? 'None' : entry.symptoms.length}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>BM Count</Text>
                  <Text style={styles.statValue}>{entry.poopCount}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Water</Text>
                  <Text style={styles.statValue}>{entry.waterIntake}</Text>
                </View>
              </View>

              {entry.symptoms.length > 0 && (
                <View style={styles.symptomsList}>
                  {entry.symptoms.slice(0, 3).map((symptom, idx) => (
                    <View key={idx} style={styles.symptomPill}>
                      <Text style={styles.symptomText}>{symptom}</Text>
                    </View>
                  ))}
                  {entry.symptoms.length > 3 && (
                    <Text style={styles.moreSymptoms}>
                      +{entry.symptoms.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
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
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  entriesContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  moodIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  entryStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  symptomPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  moreSymptoms: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 32,
  },
});