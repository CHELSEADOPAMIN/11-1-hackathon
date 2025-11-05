import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function formatTime(
  date: Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export type GreetingKey = 'lateNight' | 'goodMorning' | 'goodAfternoon' | 'goodEvening'

export function getGreetingKey(): GreetingKey {
  const hour = new Date().getHours()
  if (hour < 6) return 'lateNight'
  if (hour < 12) return 'goodMorning'
  if (hour < 18) return 'goodAfternoon'
  return 'goodEvening'
}
