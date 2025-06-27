import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {
  Heart,
  Droplets,
  Pill,
  Activity,
  UtensilsCrossed,
  FileText,
  Plus,
  Minus,
} from 'lucide-react-native';

interface DailyLog {
  mood: number;
  symptoms: string[];
  poopCount: number;
  poopType: number;
  waterIntake: number;
  supplements: string[];
  exercise: string;
  foods: string[];
  notes: string;
}

export default function TodayTab() {
  const [log, setLog] = useState<DailyLog>({
    mood: 5,
    symptoms: [],
    poopCount: 0,
    poopType: 4,
    waterIntake: 0,
    supplements: [],
    exercise: '',
    foods: [],
    notes: '',
  });

  const [newFood, setNewFood] = useState('');
  const [newSupplement, setNewSupplement] = useState('');

  const symptoms = [
    'Cramping', 'Bloating', 'Gas', 'Diarrhea', 'Constipation', 
    'Nausea', 'Fatigue', 'Anxiety', 'Urgency'
  ];

  const commonSupplements = [
    'Probiotics', 'Fiber', 'Digestive Enzymes', 'Magnesium',
    'Peppermint Oil', 'IBgard', 'Vitamin D', 'B12'
  ];

  const bristolScale = [
    'Type 1: Hard lumps',
    'Type 2: Lumpy sausage',
    'Type 3: Cracked sausage',
    'Type 4: Smooth sausage',
    'Type 5: Soft blobs',
    'Type 6: Mushy consistency',
    'Type 7: Liquid consistency'
  ];

  const toggleSymptom = (symptom: string) => {
    setLog(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const toggleSupplement = (supplement: string) => {
    setLog(prev => ({
      ...prev,
      supplements: prev.supplements.includes(supplement)
        ? prev.supplements.filter(s => s !== supplement)
        : [...prev.supplements, supplement]
    }));
  };

  const addFood = () => {
    if (newFood.trim()) {
      setLog(prev => ({
        ...prev,
        foods: [...prev.foods, newFood.trim()]
      }));
      setNewFood('');
    }
  };

  const addCustomSupplement = () => {
    if (newSupplement.trim()) {
      setLog(prev => ({
        ...prev,
        supplements: [...prev.supplements, newSupplement.trim()]
      }));
      setNewSupplement('');
    }
  };

  const removeFood = (index: number) => {
    setLog(prev => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index)
    }));
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Log</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>

        {/* Mood Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
          </View>
          <View style={styles.moodScale}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.moodButton,
                  log.mood === num && styles.moodButtonActive
                ]}
                onPress={() => setLog(prev => ({ ...prev, mood: num }))}
              >
                <Text style={[
                  styles.moodButtonText,
                  log.mood === num && styles.moodButtonTextActive
                ]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Symptoms</Text>
          </View>
          <View style={styles.pillContainer}>
            {symptoms.map(symptom => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.pill,
                  log.symptoms.includes(symptom) && styles.pillActive
                ]}
                onPress={() => toggleSymptom(symptom)}
              >
                <Text style={[
                  styles.pillText,
                  log.symptoms.includes(symptom) && styles.pillTextActive
                ]}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bowel Movement Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bowel Movements</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Number of times:</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setLog(prev => ({ 
                  ...prev, 
                  poopCount: Math.max(0, prev.poopCount - 1) 
                }))}
              >
                <Minus size={16} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{log.poopCount}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setLog(prev => ({ 
                  ...prev, 
                  poopCount: prev.poopCount + 1 
                }))}
              >
                <Plus size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>Bristol Stool Scale:</Text>
          <View style={styles.bristolContainer}>
            {bristolScale.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.bristolOption,
                  log.poopType === index + 1 && styles.bristolOptionActive
                ]}
                onPress={() => setLog(prev => ({ ...prev, poopType: index + 1 }))}
              >
                <Text style={[
                  styles.bristolText,
                  log.poopType === index + 1 && styles.bristolTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Water Intake Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Droplets size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Water Intake</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Glasses (8oz):</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setLog(prev => ({ 
                  ...prev, 
                  waterIntake: Math.max(0, prev.waterIntake - 1) 
                }))}
              >
                <Minus size={16} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{log.waterIntake}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setLog(prev => ({ 
                  ...prev, 
                  waterIntake: prev.waterIntake + 1 
                }))}
              >
                <Plus size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.waterProgress}>
            <View 
              style={[
                styles.waterProgressFill, 
                { width: `${Math.min(100, (log.waterIntake / 8) * 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.waterGoal}>Goal: 8 glasses</Text>
        </View>

        {/* Supplements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pill size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Supplements</Text>
          </View>
          <View style={styles.pillContainer}>
            {commonSupplements.map(supplement => (
              <TouchableOpacity
                key={supplement}
                style={[
                  styles.pill,
                  log.supplements.includes(supplement) && styles.pillActive
                ]}
                onPress={() => toggleSupplement(supplement)}
              >
                <Text style={[
                  styles.pillText,
                  log.supplements.includes(supplement) && styles.pillTextActive
                ]}>
                  {supplement}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add custom supplement"
              value={newSupplement}
              onChangeText={setNewSupplement}
              onSubmitEditing={addCustomSupplement}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomSupplement}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Exercise</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="What exercise did you do today?"
            value={log.exercise}
            onChangeText={(text) => setLog(prev => ({ ...prev, exercise: text }))}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Food Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UtensilsCrossed size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Food Diary</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add food item"
              value={newFood}
              onChangeText={setNewFood}
              onSubmitEditing={addFood}
            />
            <TouchableOpacity style={styles.addButton} onPress={addFood}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.foodList}>
            {log.foods.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <Text style={styles.foodText}>{food}</Text>
                <TouchableOpacity onPress={() => removeFood(index)}>
                  <Minus size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Any additional notes about your day..."
            value={log.notes}
            onChangeText={(text) => setLog(prev => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Today's Log</Text>
        </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  moodScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  moodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  moodButtonTextActive: {
    color: '#FFFFFF',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  pillActive: {
    backgroundColor: '#DBEAFE',
  },
  pillText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#3B82F6',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  counterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  bristolContainer: {
    marginTop: 8,
  },
  bristolOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  bristolOptionActive: {
    backgroundColor: '#DBEAFE',
  },
  bristolText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bristolTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  waterProgress: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  waterGoal: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  foodList: {
    marginTop: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  foodText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
});