import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { TrendingUp, TrendingDown, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface InsightData {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  description: string;
}

const insightsData: InsightData[] = [
  {
    title: 'Average Mood',
    value: '6.7/10',
    change: 12,
    isPositive: true,
    description: 'Your mood has improved by 12% this month'
  },
  {
    title: 'Symptom Frequency',
    value: '3.2/day',
    change: -8,
    isPositive: true,
    description: 'Symptoms decreased by 8% compared to last month'
  },
  {
    title: 'Water Intake',
    value: '7.2 glasses',
    change: 5,
    isPositive: true,
    description: 'You\'re drinking 5% more water daily'
  },
  {
    title: 'Exercise Days',
    value: '18 days',
    change: 25,
    isPositive: true,
    description: 'Exercise frequency increased by 25%'
  }
];

const triggers = [
  { food: 'Dairy Products', frequency: 8, severity: 'High' },
  { food: 'Spicy Foods', frequency: 6, severity: 'Medium' },
  { food: 'Caffeine', frequency: 4, severity: 'Low' },
  { food: 'Gluten', frequency: 3, severity: 'Medium' },
];

const recommendations = [
  {
    title: 'Consistent Sleep Schedule',
    description: 'Your mood scores are higher on days with 7-8 hours of sleep',
    priority: 'High'
  },
  {
    title: 'Morning Water Intake',
    description: 'Starting the day with 2 glasses of water reduces morning symptoms',
    priority: 'Medium'
  },
  {
    title: 'Probiotic Timing',
    description: 'Taking probiotics with dinner shows better results than morning',
    priority: 'Medium'
  },
  {
    title: 'Stress Management',
    description: 'Exercise days correlate with 40% fewer anxiety symptoms',
    priority: 'High'
  }
];

export default function InsightsTab() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'quarter'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {insightsData.map((insight, index) => (
              <View key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>{insight.title}</Text>
                  <View style={styles.trendContainer}>
                    {insight.isPositive ? (
                      <TrendingUp size={16} color="#10B981" />
                    ) : (
                      <TrendingDown size={16} color="#EF4444" />
                    )}
                    <Text style={[
                      styles.trendText,
                      { color: insight.isPositive ? '#10B981' : '#EF4444' }
                    ]}>
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{insight.value}</Text>
                <Text style={styles.metricDescription}>{insight.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trigger Foods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Potential Trigger Foods</Text>
          <View style={styles.triggersList}>
            {triggers.map((trigger, index) => (
              <View key={index} style={styles.triggerCard}>
                <View style={styles.triggerHeader}>
                  <Text style={styles.triggerFood}>{trigger.food}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(trigger.severity) + '20' }
                  ]}>
                    <Text style={[
                      styles.severityText,
                      { color: getSeverityColor(trigger.severity) }
                    ]}>
                      {trigger.severity}
                    </Text>
                  </View>
                </View>
                <Text style={styles.triggerFrequency}>
                  Consumed {trigger.frequency} times this month
                </Text>
                <View style={styles.triggerBar}>
                  <View 
                    style={[
                      styles.triggerBarFill,
                      { 
                        width: `${(trigger.frequency / 10) * 100}%`,
                        backgroundColor: getSeverityColor(trigger.severity)
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          <View style={styles.recommendationsList}>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationIcon}>
                    {rec.priority === 'High' ? (
                      <AlertCircle size={20} color="#EF4444" />
                    ) : (
                      <CheckCircle size={20} color="#10B981" />
                    )}
                  </View>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(rec.priority) + '20' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: getPriorityColor(rec.priority) }
                      ]}>
                        {rec.priority} Priority
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.recommendationDescription}>{rec.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Pattern */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Pattern</Text>
          <View style={styles.patternCard}>
            <Text style={styles.patternTitle}>Best Days</Text>
            <Text style={styles.patternText}>
              Tuesdays and Thursdays show the highest mood scores and lowest symptom frequency.
            </Text>
            <Text style={styles.patternTitle}>Challenging Days</Text>
            <Text style={styles.patternText}>
              Mondays typically have higher stress levels and more digestive issues.
            </Text>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
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
    marginBottom: 16,
  },
  metricsGrid: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  triggersList: {
    gap: 12,
  },
  triggerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  triggerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  triggerFood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  triggerFrequency: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  triggerBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  triggerBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 32,
  },
  patternCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  patternText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 32,
  },
});