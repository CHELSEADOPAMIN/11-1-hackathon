"""
Mission Generator - Converts extracted treatment plan data into daily missions
with calendar integration
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta, date, time
from dateutil.parser import parse as parse_date
from dateutil.relativedelta import relativedelta
import re


class MissionGenerator:
    """
    Generate structured missions from extracted treatment plan data
    
    Converts exercises, goals, and schedules into:
    - Daily missions with due dates
    - Calendar events
    - Recurring missions
    """
    
    def __init__(self, start_date: Optional[date] = None):
        """
        Initialize mission generator
        
        Args:
            start_date: Start date for treatment plan (defaults to today)
        """
        self.start_date = start_date or date.today()
    
    def generate_missions(
        self,
        extracted_data: Dict[str, Any],
        treatment_plan_id: str,
        patient_id: str,
        default_points: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Generate missions from extracted treatment plan data
        
        Args:
            extracted_data: Output from NLPExtractor.extract_all()
            treatment_plan_id: ID of the treatment plan
            patient_id: ID of the patient
            default_points: Default points per mission
            
        Returns:
            List of mission dictionaries ready for database insertion
        """
        missions = []
        
        # Generate missions from exercises
        for exercise in extracted_data.get('exercises', []):
            exercise_missions = self._create_exercise_missions(
                exercise,
                treatment_plan_id,
                patient_id,
                default_points
            )
            missions.extend(exercise_missions)
        
        # Generate check missions from DOs
        for do_item in extracted_data.get('dos_and_donts', {}).get('dos', []):
            check_mission = self._create_check_mission(
                do_item,
                treatment_plan_id,
                patient_id,
                default_points
            )
            if check_mission:
                missions.append(check_mission)
        
        # Generate appointment missions
        for appointment in extracted_data.get('appointments', []):
            appointment_missions = self._create_appointment_missions(
                appointment,
                treatment_plan_id,
                patient_id
            )
            missions.extend(appointment_missions)
        
        return missions
    
    def _create_exercise_missions(
        self,
        exercise: Dict[str, Any],
        treatment_plan_id: str,
        patient_id: str,
        default_points: int
    ) -> List[Dict[str, Any]]:
        """Create missions for an exercise"""
        missions = []
        frequency = exercise.get('frequency', {})
        
        # Determine schedule
        schedule = frequency.get('schedule', 'daily')
        duration_days = self._calculate_duration(exercise, schedule)
        
        # Calculate duration for individual mission
        duration_minutes = None
        if frequency.get('duration_seconds'):
            duration_minutes = frequency['duration_seconds'] // 60
        
        # Create missions based on schedule
        if schedule == 'daily':
            # Create daily missions for the duration
            current_date = self.start_date
            for day in range(duration_days):
                mission = {
                    'title': exercise['name'],
                    'description': exercise.get('instructions', ''),
                    'mission_type': exercise.get('type', 'exercise'),
                    'scheduled_date': current_date.isoformat(),
                    'scheduled_time': self._get_default_time(exercise.get('type', 'exercise')),
                    'due_datetime': self._calculate_due_datetime(current_date, exercise.get('type', 'exercise')),
                    'duration_minutes': duration_minutes,
                    'points': default_points,
                    'status': 'pending',
                    'treatment_plan_id': treatment_plan_id,
                    'patient_id': patient_id,
                    'recurrence_pattern': {
                        'frequency': 'daily',
                        'end_date': (self.start_date + timedelta(days=duration_days - 1)).isoformat()
                    }
                }
                missions.append(mission)
                current_date += timedelta(days=1)
        
        elif 'weekly' in schedule or 'per week' in schedule:
            # Extract frequency (e.g., "2x per week" -> 2)
            weekly_frequency = self._extract_weekly_frequency(schedule)
            
            # Calculate days per week (e.g., 2x per week = every 3-4 days)
            days_between = 7 // weekly_frequency if weekly_frequency > 0 else 7
            
            current_date = self.start_date
            mission_count = 0
            max_missions = duration_days // (7 // weekly_frequency) if weekly_frequency > 0 else 0
            
            for _ in range(min(max_missions, duration_days)):
                mission = {
                    'title': exercise['name'],
                    'description': exercise.get('instructions', ''),
                    'mission_type': exercise.get('type', 'exercise'),
                    'scheduled_date': current_date.isoformat(),
                    'scheduled_time': self._get_default_time(exercise.get('type', 'exercise')),
                    'due_datetime': self._calculate_due_datetime(current_date, exercise.get('type', 'exercise')),
                    'duration_minutes': duration_minutes,
                    'points': default_points,
                    'status': 'pending',
                    'treatment_plan_id': treatment_plan_id,
                    'patient_id': patient_id,
                    'recurrence_pattern': {
                        'frequency': 'weekly',
                        'count': max_missions,
                        'interval': days_between
                    }
                }
                missions.append(mission)
                current_date += timedelta(days=days_between)
        
        return missions
    
    def _create_check_mission(
        self,
        do_item: str,
        treatment_plan_id: str,
        patient_id: str,
        default_points: int
    ) -> Optional[Dict[str, Any]]:
        """Create a check mission from a DO item"""
        # Skip if too short or not actionable
        if len(do_item) < 10 or len(do_item) > 200:
            return None
        
        return {
            'title': f"Check: {do_item[:50]}",
            'description': do_item,
            'mission_type': 'check',
            'scheduled_date': self.start_date.isoformat(),
            'scheduled_time': '09:00:00',
            'due_datetime': datetime.combine(
                self.start_date,
                time(23, 59)
            ).isoformat(),
            'points': default_points // 2,  # Check missions worth less
            'status': 'pending',
            'treatment_plan_id': treatment_plan_id,
            'patient_id': patient_id
        }
    
    def _create_appointment_missions(
        self,
        appointment: Dict[str, Any],
        treatment_plan_id: str,
        patient_id: str
    ) -> List[Dict[str, Any]]:
        """Create missions for appointments"""
        missions = []
        
        frequency = appointment.get('frequency_per_period', 1)
        period = appointment.get('period', 'week')
        timeframe = appointment.get('timeframe_duration', 6)
        timeframe_unit = appointment.get('timeframe_unit', 'weeks')
        
        # Calculate total number of appointments
        if period == 'week':
            total_appointments = frequency * timeframe
            days_between = 7 // frequency if frequency > 0 else 7
        else:
            # Default to weekly calculation
            total_appointments = frequency * timeframe
            days_between = 7 // frequency if frequency > 0 else 7
        
        current_date = self.start_date
        
        for i in range(total_appointments):
            mission = {
                'title': appointment.get('type', 'Therapy Session'),
                'description': f"{appointment.get('type', 'Therapy')} session {i+1}",
                'mission_type': 'therapy',
                'scheduled_date': current_date.isoformat(),
                'scheduled_time': '14:00:00',  # Default afternoon time
                'due_datetime': datetime.combine(
                    current_date,
                    time(16, 0)
                ).isoformat(),
                'duration_minutes': 60,  # Default therapy session duration
                'points': 100,  # Therapy sessions worth more points
                'status': 'pending',
                'treatment_plan_id': treatment_plan_id,
                'patient_id': patient_id
            }
            missions.append(mission)
            current_date += timedelta(days=days_between)
        
        return missions
    
    def _calculate_duration(self, exercise: Dict[str, Any], schedule: str) -> int:
        """Calculate treatment duration in days"""
        # Default to 8 weeks based on typical treatment plans
        default_weeks = 8
        
        # Try to extract from goals or other context
        raw_text = exercise.get('raw_text', '')
        
        # Look for time references
        match = re.search(r'(\d+)[-\s]*(\d+)?\s*weeks?', raw_text.lower())
        if match:
            weeks = int(match.group(1))
            return weeks * 7
        
        return default_weeks * 7
    
    def _extract_weekly_frequency(self, schedule: str) -> int:
        """Extract frequency from schedule string (e.g., '2x per week' -> 2)"""
        match = re.search(r'(\d+)\s*x?\s*per\s*week', schedule.lower())
        if match:
            return int(match.group(1))
        return 1
    
    def _get_default_time(self, mission_type: str) -> str:
        """Get default time for mission based on type"""
        defaults = {
            'exercise': '07:00:00',  # Morning exercises
            'medication': '08:00:00',  # After breakfast
            'therapy': '14:00:00',  # Afternoon therapy
            'check': '09:00:00'  # Morning check-in
        }
        return defaults.get(mission_type, '09:00:00')
    
    def _calculate_due_datetime(self, scheduled_date: date, mission_type: str) -> str:
        """Calculate due datetime for mission"""
        default_time = time.fromisoformat(self._get_default_time(mission_type))
        
        # Add default duration based on type
        duration_hours = {
            'exercise': 2,  # Exercise missions due 2 hours after scheduled time
            'medication': 1,
            'therapy': 3,
            'check': 12  # Check missions due by end of day
        }
        
        hours_to_add = duration_hours.get(mission_type, 2)
        due_time = (datetime.combine(scheduled_date, default_time) + timedelta(hours=hours_to_add)).time()
        
        return datetime.combine(scheduled_date, due_time).isoformat()
    
    def generate_calendar_events(
        self,
        missions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate calendar events from missions"""
        calendar_events = []
        
        for mission in missions:
            # Only create calendar events for certain mission types
            if mission['mission_type'] in ['therapy', 'checkup', 'appointment']:
                scheduled_date = date.fromisoformat(mission['scheduled_date'])
                scheduled_time = time.fromisoformat(mission['scheduled_time'])
                
                start_datetime = datetime.combine(scheduled_date, scheduled_time)
                end_datetime = start_datetime + timedelta(minutes=mission.get('duration_minutes', 60))
                
                event = {
                    'title': mission['title'],
                    'description': mission.get('description', ''),
                    'event_type': mission['mission_type'],
                    'start_datetime': start_datetime.isoformat(),
                    'end_datetime': end_datetime.isoformat(),
                    'mission_id': mission.get('id'),  # Will be set after mission creation
                    'patient_id': mission['patient_id'],
                    'is_all_day': False,
                    'reminder_minutes': [1440, 60]  # 1 day and 1 hour before
                }
                
                calendar_events.append(event)
        
        return calendar_events


if __name__ == '__main__':
    # Example usage
    generator = MissionGenerator(start_date=date.today())
    
    extracted_data = {
        'exercises': [
            {
                'name': 'Pec Stretch',
                'instructions': 'Stand in doorway, lean forward',
                'frequency': {
                    'sets': 3,
                    'duration_seconds': 30,
                    'schedule': 'daily'
                },
                'type': 'exercise'
            }
        ],
        'dos_and_donts': {
            'dos': ['Perform exercises daily', 'Apply ice if sore']
        }
    }
    
    missions = generator.generate_missions(
        extracted_data,
        treatment_plan_id='test-plan-123',
        patient_id='test-patient-456'
    )
    
    print(f"Generated {len(missions)} missions")
    for mission in missions[:3]:
        print(f"- {mission['title']} on {mission['scheduled_date']}")

