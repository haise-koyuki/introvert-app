import { formatDistanceToNow } from 'date-fns';
import { Message, Contact } from './types';

// Convert reminder time string to milliseconds
export function reminderTimeToMs(timeString: string): number {
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1), 10);
  
  if (unit === 'h') {
    return value * 60 * 60 * 1000; // hours to ms
  } else if (unit === 'd') {
    return value * 24 * 60 * 60 * 1000; // days to ms
  }
  
  return 0;
}

// Calculate how much progress (0-100) has been made towards the reminder deadline
export function calculateReminderProgress(message: Message, contact: Contact): number {
  // Get the reminder timeframe in milliseconds
  const reminderTimeMs = reminderTimeToMs(contact.reminderTime);
  
  // Calculate time elapsed since the message was received
  const now = new Date();
  const messageReceivedTime = new Date(message.receivedAt);
  const elapsedMs = now.getTime() - messageReceivedTime.getTime();
  
  // Calculate progress as a percentage
  const progressPercentage = Math.min(Math.floor((elapsedMs / reminderTimeMs) * 100), 100);
  
  return progressPercentage;
}

// Format a reminder time for display
export function formatReminderTime(timeString: string): string {
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1), 10);
  
  if (unit === 'h') {
    return value === 1 ? '1 hour' : `${value} hours`;
  } else if (unit === 'd') {
    return value === 1 ? '1 day' : `${value} days`;
  }
  
  return timeString;
}

// Format a date as "time ago" (e.g., "2 hours ago")
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Check if a message is overdue based on priority and timeframe
export function isMessageOverdue(message: Message, contact: Contact): boolean {
  const reminderTimeMs = reminderTimeToMs(contact.reminderTime);
  const now = new Date();
  const messageReceivedTime = new Date(message.receivedAt);
  const elapsedMs = now.getTime() - messageReceivedTime.getTime();
  
  return elapsedMs > reminderTimeMs;
}

// Get a formatted string for the reminder deadline
export function getReminderDeadline(message: Message, contact: Contact): string {
  const reminderTimeMs = reminderTimeToMs(contact.reminderTime);
  const messageReceivedTime = new Date(message.receivedAt);
  const deadlineTime = new Date(messageReceivedTime.getTime() + reminderTimeMs);
  
  return formatTimeAgo(deadlineTime);
}