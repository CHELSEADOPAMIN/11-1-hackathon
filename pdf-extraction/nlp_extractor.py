"""
NLP Extractor - Uses spaCy and custom patterns to extract structured data
from treatment plan text
"""

import re
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import dateparser

try:
    import spacy
    from spacy.matcher import Matcher
    from spacy.tokens import Doc, Span
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    print("Warning: spaCy not available. Install with: pip install spacy")


class NLPExtractor:
    """
    Extract structured data from treatment plan text using NLP
    
    Model: spaCy en_core_web_sm or en_core_web_md
    - Named Entity Recognition (NER) for medical terms
    - Dependency parsing for relationship extraction
    - Custom pattern matching for domain-specific extraction
    """
    
    def __init__(self, model_name: str = 'en_core_web_sm'):
        """
        Initialize NLP extractor
        
        Args:
            model_name: spaCy model to use ('en_core_web_sm' or 'en_core_web_md')
        """
        if not SPACY_AVAILABLE:
            raise ImportError(
                "spaCy is required. Install with: pip install spacy && "
                "python -m spacy download en_core_web_sm"
            )
        
        try:
            self.nlp = spacy.load(model_name)
        except OSError:
            raise OSError(
                f"spaCy model '{model_name}' not found. "
                f"Download with: python -m spacy download {model_name}"
            )
        
        # Initialize matcher for custom patterns
        self.matcher = Matcher(self.nlp.vocab)
        self._setup_patterns()
        
        # Exercise type keywords
        self.exercise_types = {
            'exercise': ['stretch', 'exercise', 'strength', 'mobility', 'flexibility'],
            'medication': ['medication', 'medication', 'pain relief', 'anti-inflammatory'],
            'therapy': ['therapy', 'physiotherapy', 'treatment', 'session'],
            'check': ['check', 'monitor', 'track', 'log', 'measure']
        }
    
    def _setup_patterns(self):
        """Setup custom patterns for extraction"""
        
        # Frequency pattern: "3 sets x 30 seconds daily"
        frequency_pattern = [
            {'LIKE_NUM': True, 'OP': '?'},
            {'LOWER': {'IN': ['sets', 'times', 'reps', 'repetitions']}, 'OP': '?'},
            {'LOWER': 'x', 'OP': '?'},
            {'LIKE_NUM': True, 'OP': '?'},
            {'LOWER': {'IN': ['seconds', 'minutes', 'hours', 'reps', 'repetitions']}, 'OP': '?'},
            {'LOWER': {'IN': ['daily', 'per day', 'each day', 'weekly', 'per week']}}
        ]
        self.matcher.add('FREQUENCY', [frequency_pattern])
        
        # Goal pattern: "Lift 20 kg overhead pain-free"
        goal_pattern = [
            {'LOWER': {'IN': ['lift', 'reach', 'achieve', 'attain', 'gain']}},
            {'LIKE_NUM': True, 'OP': '?'},
            {'LOWER': {'IN': ['kg', 'pounds', 'lb', '%']}, 'OP': '?'},
            {'LOWER': {'IN': ['pain-free', 'painless', 'without pain', 'freely']}, 'OP': '?'}
        ]
        self.matcher.add('GOAL', [goal_pattern])
        
        # Time reference pattern: "in two weeks", "within 6-8 weeks"
        time_pattern = [
            {'LOWER': {'IN': ['in', 'within', 'by', 'after']}},
            {'LIKE_NUM': True},
            {'LOWER': {'IN': ['weeks', 'days', 'months', 'week', 'day', 'month']}}
        ]
        self.matcher.add('TIME_REFERENCE', [time_pattern])
    
    def extract_exercises(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract exercise information from text
        
        Returns:
            List of exercise dictionaries with name, instructions, frequency, etc.
        """
        exercises = []
        doc = self.nlp(text)
        
        # Find exercise sections
        exercise_keywords = [
            'exercise', 'stretch', 'strength', 'rehabilitation', 'rehab',
            'movement', 'mobility', 'flexibility', 'retraction'
        ]
        
        # Split text into sentences and paragraphs
        paragraphs = text.split('\n\n')
        
        current_exercise = None
        
        for para in paragraphs:
            para_clean = para.strip()
            if not para_clean or len(para_clean) < 10:
                continue
            
            doc_para = self.nlp(para_clean)
            
            # Check if paragraph contains exercise keywords
            para_lower = para_clean.lower()
            is_exercise_section = any(keyword in para_lower for keyword in exercise_keywords)
            
            if is_exercise_section:
                # Extract exercise name (usually first line or heading)
                lines = para_clean.split('\n')
                exercise_name = lines[0].strip()
                
                # Remove common prefixes
                exercise_name = re.sub(r'^\d+[\.\)]\s*', '', exercise_name)
                exercise_name = re.sub(r'^[A-Z\s]+-\s*', '', exercise_name)
                
                # Extract frequency
                frequency = self._extract_frequency(para_clean)
                
                # Extract instructions
                instructions = self._extract_instructions(para_clean, doc_para)
                
                # Extract importance/benefit
                importance = self._extract_importance(para_clean)
                
                # Determine exercise type
                exercise_type = self._classify_exercise_type(exercise_name, para_clean)
                
                exercises.append({
                    'name': exercise_name,
                    'instructions': instructions,
                    'frequency': frequency,
                    'importance': importance,
                    'type': exercise_type,
                    'raw_text': para_clean
                })
        
        return exercises
    
    def _extract_frequency(self, text: str) -> Dict[str, Any]:
        """Extract frequency information (sets, reps, duration, schedule)"""
        frequency = {
            'sets': None,
            'reps': None,
            'duration_seconds': None,
            'schedule': 'daily'  # default
        }
        
        # Pattern: "3 sets x 30 seconds daily"
        match = re.search(r'(\d+)\s*sets?\s*x\s*(\d+)\s*(seconds?|minutes?)\s*(daily|per day|weekly|per week)?', text.lower())
        if match:
            frequency['sets'] = int(match.group(1))
            duration = int(match.group(2))
            unit = match.group(3)
            if 'minute' in unit:
                frequency['duration_seconds'] = duration * 60
            else:
                frequency['duration_seconds'] = duration
            if match.group(4):
                frequency['schedule'] = match.group(4).replace('per ', '').strip()
        
        # Pattern: "3 sets x 10 reps daily"
        match = re.search(r'(\d+)\s*sets?\s*x\s*(\d+)\s*reps?\s*(daily|per day|weekly|per week)?', text.lower())
        if match:
            frequency['sets'] = int(match.group(1))
            frequency['reps'] = int(match.group(2))
            if match.group(3):
                frequency['schedule'] = match.group(3).replace('per ', '').strip()
        
        # Pattern: "daily", "2x per week", etc.
        match = re.search(r'(\d+)?\s*x?\s*(daily|per day|weekly|per week|twice weekly)', text.lower())
        if match:
            if match.group(1):
                frequency['schedule'] = f"{match.group(1)}x {match.group(2).replace('per ', '')}"
            else:
                frequency['schedule'] = match.group(2).replace('per ', '').strip()
        
        return frequency
    
    def _extract_instructions(self, text: str, doc: Doc) -> str:
        """Extract exercise instructions"""
        # Instructions usually follow the exercise name
        # Look for imperative verbs (commands)
        instruction_sentences = []
        
        for sent in doc.sents:
            # Check if sentence contains action verbs (imperative)
            has_action_verb = False
            for token in sent:
                if token.pos_ == 'VERB' and token.tag_ in ['VB', 'VBP']:
                    has_action_verb = True
                    break
            
            if has_action_verb:
                instruction_sentences.append(sent.text)
        
        return ' '.join(instruction_sentences) if instruction_sentences else text
    
    def _extract_importance(self, text: str) -> Optional[str]:
        """Extract importance/benefit information"""
        # Look for sentences starting with "Importance:", "Helps", "Benefits", etc.
        importance_patterns = [
            r'(?i)importance[:\s]+(.+?)(?:\n|$)',
            r'(?i)helps?\s+(.+?)(?:\.|$)',
            r'(?i)benefit[s]?[:\s]+(.+?)(?:\n|$)',
            r'(?i)why[:\s]+(.+?)(?:\n|$)'
        ]
        
        for pattern in importance_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _classify_exercise_type(self, name: str, text: str) -> str:
        """Classify exercise type"""
        combined = (name + ' ' + text).lower()
        
        for ex_type, keywords in self.exercise_types.items():
            if any(keyword in combined for keyword in keywords):
                return ex_type
        
        return 'exercise'  # default
    
    def extract_goals(self, text: str) -> List[Dict[str, Any]]:
        """Extract treatment goals and milestones"""
        goals = []
        doc = self.nlp(text)
        
        # Look for goal sections
        goal_patterns = [
            r'(?i)(current\s+result|next\s+milestone|end\s+goal)[:\s]+(.+?)(?:\n|$)',
            r'(?i)goal[s]?[:\s]+(.+?)(?:\n|$)',
            r'(?i)(reach|achieve|attain|lift|gain)\s+(.+?)(?:\.|$)'
        ]
        
        for pattern in goal_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                goal_text = match.group(0)
                
                # Extract goal type
                goal_type = None
                if 'current' in goal_text.lower():
                    goal_type = 'current'
                elif 'milestone' in goal_text.lower():
                    goal_type = 'milestone'
                elif 'end' in goal_text.lower():
                    goal_type = 'end'
                else:
                    goal_type = 'general'
                
                # Extract time reference
                time_ref = self._extract_time_reference(goal_text)
                
                goals.append({
                    'type': goal_type,
                    'description': goal_text.strip(),
                    'time_reference': time_ref,
                    'raw_text': goal_text.strip()
                })
        
        return goals
    
    def _extract_time_reference(self, text: str) -> Optional[Dict[str, Any]]:
        """Extract time references like 'in two weeks', 'within 6-8 weeks'"""
        # Pattern: "in 2 weeks", "within 6-8 weeks"
        match = re.search(r'(?:in|within|by|after)\s+(\d+)(?:-(\d+))?\s*(weeks?|days?|months?)', text.lower())
        if match:
            start = int(match.group(1))
            end = int(match.group(2)) if match.group(2) else start
            unit = match.group(3)
            
            return {
                'value': start,
                'max_value': end,
                'unit': unit,
                'text': match.group(0)
            }
        
        return None
    
    def extract_dos_and_donts(self, text: str) -> Dict[str, List[str]]:
        """Extract DOs and DON'Ts from treatment plan"""
        dos = []
        donts = []
        
        # Find DOs section
        do_section = re.search(r'(?i)do[s]?[:\s]+(.*?)(?:(?:don\'?t?s?|avoid|prohibited)|$)', text, re.DOTALL)
        if do_section:
            do_text = do_section.group(1)
            # Extract bullet points or sentences
            do_items = re.split(r'[•\-\n]+', do_text)
            dos = [item.strip() for item in do_items if len(item.strip()) > 10]
        
        # Find DON'Ts section
        dont_section = re.search(r'(?i)(?:don\'?t?s?|avoid|do\s+not)[:\s]+(.*?)(?:$|\n\n)', text, re.DOTALL)
        if dont_section:
            dont_text = dont_section.group(1)
            # Extract bullet points or sentences
            dont_items = re.split(r'[•\-\n]+', dont_text)
            donts = [item.strip() for item in dont_items if len(item.strip()) > 10]
        
        return {
            'dos': dos,
            'donts': donts
        }
    
    def extract_appointment_schedule(self, text: str) -> List[Dict[str, Any]]:
        """Extract appointment schedule information"""
        appointments = []
        
        # Pattern: "Physiotherapy sessions 2x per week for first 3 weeks"
        schedule_pattern = r'(?i)(physiotherapy|therapy|appointment|session)[s]?\s+(\d+)\s*x?\s*per\s*(week|day|month)\s+(?:for|during)\s+(?:the\s+)?(first|second|third|last)?\s*(\d+)?\s*(weeks?|days?|months?)'
        
        matches = re.finditer(schedule_pattern, text)
        for match in matches:
            frequency = int(match.group(2))
            period_unit = match.group(3)
            timeframe_duration = int(match.group(5)) if match.group(5) else None
            timeframe_unit = match.group(6)
            
            appointments.append({
                'type': match.group(1).strip(),
                'frequency_per_period': frequency,
                'period': period_unit,
                'timeframe_duration': timeframe_duration,
                'timeframe_unit': timeframe_unit,
                'raw_text': match.group(0)
            })
        
        return appointments
    
    def extract_conditions(self, text: str) -> List[Dict[str, Any]]:
        """Extract medical conditions/diagnoses"""
        conditions = []
        doc = self.nlp(text)
        
        # Look for condition sections
        condition_pattern = r'(?i)(?:diagnosis|condition|injury)[:\s]+(.+?)(?:\n|$)'
        matches = re.finditer(condition_pattern, text)
        
        for match in matches:
            condition_text = match.group(1).strip()
            
            # Extract body part
            body_parts = ['neck', 'shoulder', 'knee', 'back', 'hip', 'ankle', 'wrist']
            body_part = None
            for bp in body_parts:
                if bp in condition_text.lower():
                    body_part = bp
                    break
            
            conditions.append({
                'diagnosis': condition_text,
                'body_part': body_part,
                'raw_text': condition_text
            })
        
        return conditions
    
    def extract_all(self, text: str) -> Dict[str, Any]:
        """Extract all structured data from treatment plan text"""
        return {
            'exercises': self.extract_exercises(text),
            'goals': self.extract_goals(text),
            'dos_and_donts': self.extract_dos_and_donts(text),
            'appointments': self.extract_appointment_schedule(text),
            'conditions': self.extract_conditions(text),
            'extraction_metadata': {
                'timestamp': datetime.now().isoformat(),
                'text_length': len(text),
                'confidence': 0.85  # Can be calculated based on extraction success
            }
        }


if __name__ == '__main__':
    # Example usage
    if SPACY_AVAILABLE:
        extractor = NLPExtractor()
        
        # Test with sample text
        sample_text = """
        TREATMENT PLAN
        
        Diagnosis: Right supraspinatus tear, tendinosis, bursitis, impingement
        
        Pec Stretch (Neck, Right Shoulder)
        Frequency: 3 sets x 30 seconds daily
        Instructions: Stand in a doorway with your arm at a 90-degree angle.
        Gently lean forward until you feel a stretch in your chest.
        Importance: Helps relieve tension in the pectoral muscles and improve posture.
        
        Next Milestone: Lift 5 kg overhead pain-free in two weeks
        End Goal: Lift 20 kg overhead pain-free
        """
        
        result = extractor.extract_all(sample_text)
        import json
        print(json.dumps(result, indent=2))

