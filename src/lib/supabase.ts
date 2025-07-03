import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid Supabase URL format: "${supabaseUrl}". Please ensure VITE_SUPABASE_URL is a valid URL (e.g., https://your-project-id.supabase.co)`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface DailyLog {
  id: string
  user_id: string
  log_date: string
  mood: number
  poop_count: number
  poop_type: number
  water_intake: number
  exercise: string
  notes: string
  created_at: string
  updated_at: string
  symptoms?: Symptom[]
  supplements?: Supplement[]
  foods?: Food[]
}

export interface Symptom {
  id: string
  log_id: string
  symptom_name: string
  created_at: string
}

export interface Supplement {
  id: string
  log_id: string
  supplement_name: string
  created_at: string
}

export interface Food {
  id: string
  log_id: string
  food_name: string
  created_at: string
}

// Database service functions
export const dbService = {
  // Get or create today's log
  async getTodaysLog(): Promise<DailyLog | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('daily_logs')
      .select(`
        *,
        symptoms(*),
        supplements(*),
        foods(*)
      `)
      .eq('user_id', user.id)
      .eq('log_date', today)
      .maybeSingle()

    if (error) {
      console.error('Error fetching today\'s log:', error)
      return null
    }

    return data
  },

  // Create or update daily log
  async saveDailyLog(logData: Partial<DailyLog>): Promise<DailyLog | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('daily_logs')
      .upsert({
        user_id: user.id,
        log_date: today,
        mood: logData.mood || 5,
        poop_count: logData.poop_count || 0,
        poop_type: logData.poop_type || 4,
        water_intake: logData.water_intake || 0,
        exercise: logData.exercise || '',
        notes: logData.notes || '',
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving daily log:', error)
      return null
    }

    return data
  },

  // Save symptoms for a log
  async saveSymptoms(logId: string, symptoms: string[]): Promise<void> {
    // First, delete existing symptoms
    await supabase
      .from('symptoms')
      .delete()
      .eq('log_id', logId)

    // Then insert new symptoms
    if (symptoms.length > 0) {
      const symptomData = symptoms.map(symptom => ({
        log_id: logId,
        symptom_name: symptom
      }))

      const { error } = await supabase
        .from('symptoms')
        .insert(symptomData)

      if (error) {
        console.error('Error saving symptoms:', error)
      }
    }
  },

  // Save supplements for a log
  async saveSupplements(logId: string, supplements: string[]): Promise<void> {
    // First, delete existing supplements
    await supabase
      .from('supplements')
      .delete()
      .eq('log_id', logId)

    // Then insert new supplements
    if (supplements.length > 0) {
      const supplementData = supplements.map(supplement => ({
        log_id: logId,
        supplement_name: supplement
      }))

      const { error } = await supabase
        .from('supplements')
        .insert(supplementData)

      if (error) {
        console.error('Error saving supplements:', error)
      }
    }
  },

  // Save foods for a log
  async saveFoods(logId: string, foods: string[]): Promise<void> {
    // First, delete existing foods
    await supabase
      .from('foods')
      .delete()
      .eq('log_id', logId)

    // Then insert new foods
    if (foods.length > 0) {
      const foodData = foods.map(food => ({
        log_id: logId,
        food_name: food
      }))

      const { error } = await supabase
        .from('foods')
        .insert(foodData)

      if (error) {
        console.error('Error saving foods:', error)
      }
    }
  },

  // Get logs for history view
  async getLogsForMonth(year: number, month: number): Promise<DailyLog[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_logs')
      .select(`
        *,
        symptoms(*),
        supplements(*),
        foods(*)
      `)
      .eq('user_id', user.id)
      .gte('log_date', startDate)
      .lte('log_date', endDate)
      .order('log_date', { ascending: false })

    if (error) {
      console.error('Error fetching logs:', error)
      return []
    }

    return data || []
  },

  // Get insights data
  async getInsightsData(period: 'week' | 'month' | 'quarter'): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    let daysBack = 30
    if (period === 'week') daysBack = 7
    if (period === 'quarter') daysBack = 90

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_logs')
      .select(`
        *,
        symptoms(*),
        supplements(*),
        foods(*)
      `)
      .eq('user_id', user.id)
      .gte('log_date', startDateStr)
      .order('log_date', { ascending: false })

    if (error) {
      console.error('Error fetching insights data:', error)
      return null
    }

    return data || []
  }
}