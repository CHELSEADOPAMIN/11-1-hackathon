"""
User Matcher - Matches users with similar daily missions for lobby recommendations
"""

from typing import Dict, List, Any, Optional
from datetime import date, timedelta
from collections import Counter
import re


class UserMatcher:
    """
    Match users based on similar daily missions, injury types, and treatment plans
    
    Matching criteria:
    1. Same daily missions on the same dates
    2. Similar injury types/conditions
    3. Similar exercise types
    4. Similar recovery stage
    """
    
    def __init__(self):
        self.similarity_threshold = 0.6  # Minimum similarity score for matching
    
    def find_matching_users(
        self,
        current_user_id: str,
        current_user_missions: List[Dict[str, Any]],
        all_users: List[Dict[str, Any]],
        all_user_missions: Dict[str, List[Dict[str, Any]]]
    ) -> List[Dict[str, Any]]:
        """
        Find users with similar daily missions
        
        Args:
            current_user_id: ID of the current user
            current_user_missions: List of current user's missions
            all_users: List of all user profiles (with patient_profiles)
            all_user_missions: Dict mapping user_id -> list of missions
            
        Returns:
            List of matched users with similarity scores and match reasons
        """
        matches = []
        
        # Get today's missions for current user
        today = date.today()
        today_missions = [
            m for m in current_user_missions
            if date.fromisoformat(m.get('scheduled_date', '')) == today
        ]
        
        # Extract mission characteristics
        current_mission_features = self._extract_mission_features(today_missions)
        
        for user in all_users:
            if user['id'] == current_user_id:
                continue
            
            user_id = user['id']
            user_missions = all_user_missions.get(user_id, [])
            
            if not user_missions:
                continue
            
            # Get today's missions for this user
            user_today_missions = [
                m for m in user_missions
                if date.fromisoformat(m.get('scheduled_date', '')) == today
            ]
            
            if not user_today_missions:
                continue
            
            # Calculate similarity
            similarity_score, match_reasons = self._calculate_similarity(
                current_mission_features,
                user_today_missions,
                user
            )
            
            if similarity_score >= self.similarity_threshold:
                matches.append({
                    'user': user,
                    'similarity_score': similarity_score,
                    'match_reasons': match_reasons,
                    'common_missions': self._find_common_missions(
                        today_missions,
                        user_today_missions
                    )
                })
        
        # Sort by similarity score (highest first)
        matches.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return matches
    
    def _extract_mission_features(self, missions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract features from missions for comparison"""
        features = {
            'mission_types': [],
            'exercise_names': [],
            'body_parts': [],
            'keywords': []
        }
        
        for mission in missions:
            # Extract mission type
            features['mission_types'].append(mission.get('mission_type', ''))
            
            # Extract exercise name keywords
            title = mission.get('title', '').lower()
            features['exercise_names'].append(title)
            
            # Extract body parts from title
            body_parts = self._extract_body_parts(title)
            features['body_parts'].extend(body_parts)
            
            # Extract keywords from description
            description = mission.get('description', '').lower()
            keywords = self._extract_keywords(title + ' ' + description)
            features['keywords'].extend(keywords)
        
        # Count frequencies
        features['mission_type_counts'] = Counter(features['mission_types'])
        features['body_part_counts'] = Counter(features['body_parts'])
        features['keyword_counts'] = Counter(features['keywords'])
        
        return features
    
    def _extract_body_parts(self, text: str) -> List[str]:
        """Extract body parts mentioned in text"""
        body_parts = [
            'neck', 'shoulder', 'knee', 'back', 'spine', 'hip', 'ankle',
            'wrist', 'elbow', 'wrist', 'arm', 'leg', 'foot', 'hand'
        ]
        
        found_parts = []
        text_lower = text.lower()
        
        for part in body_parts:
            if part in text_lower:
                found_parts.append(part)
        
        return found_parts
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        # Common physiotherapy keywords
        keywords = [
            'stretch', 'strength', 'mobility', 'flexibility', 'pain', 'rehabilitation',
            'therapy', 'exercise', 'retraction', 'rotation', 'extension', 'flexion',
            'overhead', 'posture', 'range', 'motion', 'recovery', 'healing'
        ]
        
        found_keywords = []
        text_lower = text.lower()
        
        for keyword in keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def _calculate_similarity(
        self,
        current_features: Dict[str, Any],
        other_missions: List[Dict[str, Any]],
        other_user: Dict[str, Any]
    ) -> tuple[float, List[str]]:
        """
        Calculate similarity score between current user and another user
        
        Returns:
            Tuple of (similarity_score, match_reasons)
        """
        score = 0.0
        reasons = []
        
        # Extract features for other user
        other_features = self._extract_mission_features(other_missions)
        
        # 1. Compare mission types (weight: 0.3)
        type_similarity = self._compare_counters(
            current_features['mission_type_counts'],
            other_features['mission_type_counts']
        )
        if type_similarity > 0.5:
            score += type_similarity * 0.3
            reasons.append("Similar mission types")
        
        # 2. Compare exercise names/keywords (weight: 0.4)
        keyword_similarity = self._compare_counters(
            current_features['keyword_counts'],
            other_features['keyword_counts']
        )
        if keyword_similarity > 0.5:
            score += keyword_similarity * 0.4
            reasons.append("Similar exercises")
        
        # 3. Compare body parts (weight: 0.2)
        body_part_similarity = self._compare_counters(
            current_features['body_part_counts'],
            other_features['body_part_counts']
        )
        if body_part_similarity > 0.5:
            score += body_part_similarity * 0.2
            reasons.append("Same body parts")
        
        # 4. Compare injury types (weight: 0.1)
        current_injury = current_features.get('injury_type', '')
        other_injury = other_user.get('patient_profile', {}).get('injury_type', '')
        
        if current_injury and other_injury:
            injury_similarity = self._text_similarity(current_injury, other_injury)
            if injury_similarity > 0.6:
                score += injury_similarity * 0.1
                reasons.append("Similar injury type")
        
        return min(score, 1.0), reasons
    
    def _compare_counters(self, counter1: Counter, counter2: Counter) -> float:
        """Compare two Counter objects and return similarity score (0-1)"""
        if not counter1 or not counter2:
            return 0.0
        
        # Get common keys
        common_keys = set(counter1.keys()) & set(counter2.keys())
        if not common_keys:
            return 0.0
        
        # Calculate Jaccard similarity weighted by counts
        total_items_1 = sum(counter1.values())
        total_items_2 = sum(counter2.values())
        
        if total_items_1 == 0 or total_items_2 == 0:
            return 0.0
        
        # Calculate weighted intersection
        intersection = sum(min(counter1[k], counter2[k]) for k in common_keys)
        union = total_items_1 + total_items_2 - intersection
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def _text_similarity(self, text1: str, text2: str) -> float:
        """Calculate simple text similarity using word overlap"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    def _find_common_missions(
        self,
        missions1: List[Dict[str, Any]],
        missions2: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Find missions that are similar between two users"""
        common = []
        
        # Normalize mission titles for comparison
        titles1 = {m['title'].lower().strip(): m for m in missions1}
        
        for mission2 in missions2:
            title2 = mission2['title'].lower().strip()
            
            # Check for exact match
            if title2 in titles1:
                common.append({
                    'mission': mission2,
                    'match_type': 'exact'
                })
            else:
                # Check for similarity
                similarity = max(
                    self._text_similarity(title2, title1)
                    for title1 in titles1.keys()
                )
                if similarity > 0.7:
                    common.append({
                        'mission': mission2,
                        'match_type': 'similar',
                        'similarity': similarity
                    })
        
        return common
    
    def create_lobby_recommendations(
        self,
        matches: List[Dict[str, Any]],
        max_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        """Create lobby recommendations based on matched users"""
        recommendations = []
        
        for match in matches[:max_recommendations]:
            user = match['user']
            common_missions = match['common_missions']
            
            recommendation = {
                'user_id': user['id'],
                'user_name': user.get('full_name', ''),
                'user_injury_type': user.get('patient_profile', {}).get('injury_type', ''),
                'similarity_score': match['similarity_score'],
                'match_reasons': match['match_reasons'],
                'common_mission_count': len(common_missions),
                'common_missions_preview': [
                    m['mission']['title'] for m in common_missions[:3]
                ],
                'lobby_suggestion': self._generate_lobby_suggestion(match)
            }
            
            recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_lobby_suggestion(self, match: Dict[str, Any]) -> str:
        """Generate a friendly lobby suggestion message"""
        reasons = match['match_reasons']
        common_count = len(match['common_missions'])
        
        if common_count > 0:
            return f"You both have {common_count} similar daily missions! " \
                   f"Perfect time to connect and support each other."
        elif reasons:
            reason_str = ', '.join(reasons[:2])
            return f"You share {reason_str}. Join them for mutual support!"
        else:
            return "Connect with this user for recovery support!"


if __name__ == '__main__':
    # Example usage
    matcher = UserMatcher()
    
    # Example data
    current_user_missions = [
        {
            'title': 'Pec Stretch',
            'mission_type': 'exercise',
            'scheduled_date': date.today().isoformat(),
            'description': 'Stand in doorway stretch'
        },
        {
            'title': 'Neck Retractions',
            'mission_type': 'exercise',
            'scheduled_date': date.today().isoformat(),
            'description': 'Improve neck posture'
        }
    ]
    
    all_users = [
        {
            'id': 'user-2',
            'full_name': 'Jane Doe',
            'patient_profile': {'injury_type': 'Right Shoulder - Strength'}
        }
    ]
    
    all_user_missions = {
        'user-2': [
            {
                'title': 'Pec Stretch',
                'mission_type': 'exercise',
                'scheduled_date': date.today().isoformat(),
                'description': 'Doorway stretch exercise'
            }
        ]
    }
    
    matches = matcher.find_matching_users(
        'user-1',
        current_user_missions,
        all_users,
        all_user_missions
    )
    
    recommendations = matcher.create_lobby_recommendations(matches)
    print(f"Found {len(recommendations)} lobby recommendations")
    for rec in recommendations:
        print(f"- {rec['user_name']}: {rec['lobby_suggestion']}")

