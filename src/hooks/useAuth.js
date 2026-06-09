import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setUser(null)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, isGuest: !supabase }
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error?.message ?? null
}

export async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password })
  return error?.message ?? null
}

export async function signOut() {
  await supabase?.auth.signOut()
}

// Pull user progress from Supabase and merge into local state
export async function loadCloudProgress(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

// Push local state up to Supabase
export async function saveCloudProgress(userId, progress) {
  if (!supabase) return
  const localProgress = JSON.parse(localStorage.getItem('mathcrack_progress') || '{}')
  await supabase.from('user_progress').upsert({
    user_id: userId,
    ...progress,
    progress: localProgress,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
}
