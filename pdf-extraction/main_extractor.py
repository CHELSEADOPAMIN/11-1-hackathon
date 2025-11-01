"""
Main Treatment Plan Extractor - Orchestrates the entire extraction pipeline
"""

from typing import Dict, Any, Optional
from pathlib import Path
import json
from datetime import date

from pdf_parser import PDFParser
from nlp_extractor import NLPExtractor
from mission_generator import MissionGenerator
from user_matcher import UserMatcher


class PDFTreatmentPlanExtractor:
    """
    Main class that orchestrates the entire extraction pipeline:
    1. PDF text extraction
    2. NLP-based structured data extraction
    3. Mission generation
    4. Calendar event creation
    """
    
    def __init__(self, nlp_model: str = 'en_core_web_sm'):
        """Initialize the extractor with all components"""
        self.pdf_parser = PDFParser()
        self.nlp_extractor = NLPExtractor(nlp_model)
        self.mission_generator = None  # Initialized with start_date later
        self.user_matcher = UserMatcher()
    
    def process_pdf(
        self,
        pdf_path: str,
        patient_id: str,
        treatment_plan_id: str,
        start_date: Optional[date] = None,
        default_points: int = 50
    ) -> Dict[str, Any]:
        """
        Process a treatment plan PDF and generate missions
        
        Args:
            pdf_path: Path to PDF file
            patient_id: ID of the patient
            treatment_plan_id: ID of the treatment plan
            start_date: Start date for missions (defaults to today)
            default_points: Default points per mission
            
        Returns:
            Dictionary containing:
            - extracted_data: Raw extracted structured data
            - missions: Generated missions
            - calendar_events: Generated calendar events
            - metadata: Processing metadata
        """
        # Step 1: Extract text from PDF
        print(f"Step 1: Extracting text from PDF: {pdf_path}")
        pdf_data = self.pdf_parser.extract_text(pdf_path)
        full_text = pdf_data['full_text']
        
        # Clean text
        cleaned_text = self.pdf_parser.clean_text(full_text)
        
        # Step 2: Extract structured data using NLP
        print("Step 2: Extracting structured data using NLP...")
        extracted_data = self.nlp_extractor.extract_all(cleaned_text)
        
        # Step 3: Generate missions
        print("Step 3: Generating missions from extracted data...")
        start_date = start_date or date.today()
        self.mission_generator = MissionGenerator(start_date)
        
        missions = self.mission_generator.generate_missions(
            extracted_data,
            treatment_plan_id,
            patient_id,
            default_points
        )
        
        # Step 4: Generate calendar events
        print("Step 4: Generating calendar events...")
        calendar_events = self.mission_generator.generate_calendar_events(missions)
        
        # Step 5: Extract sections for database storage
        sections = self.pdf_parser.identify_sections(cleaned_text)
        
        result = {
            'extracted_data': extracted_data,
            'sections': sections,
            'missions': missions,
            'calendar_events': calendar_events,
            'metadata': {
                'pdf_path': pdf_path,
                'total_pages': pdf_data['total_pages'],
                'extraction_method': pdf_data['extraction_method'],
                'text_length': len(cleaned_text),
                'missions_generated': len(missions),
                'calendar_events_generated': len(calendar_events),
                'extraction_timestamp': date.today().isoformat(),
                'confidence': self._calculate_confidence(extracted_data, missions)
            }
        }
        
        print(f"✓ Extraction complete!")
        print(f"  - {len(missions)} missions generated")
        print(f"  - {len(calendar_events)} calendar events generated")
        print(f"  - {len(extracted_data.get('exercises', []))} exercises extracted")
        print(f"  - Confidence: {result['metadata']['confidence']:.2%}")
        
        return result
    
    def _calculate_confidence(
        self,
        extracted_data: Dict[str, Any],
        missions: list
    ) -> float:
        """Calculate extraction confidence score"""
        # Base confidence
        confidence = 0.8
        
        # Increase confidence if exercises were found
        if extracted_data.get('exercises'):
            confidence += 0.1
        
        # Increase confidence if goals were found
        if extracted_data.get('goals'):
            confidence += 0.05
        
        # Increase confidence if missions were generated
        if missions:
            confidence += 0.05
        
        return min(confidence, 1.0)
    
    def save_results(
        self,
        results: Dict[str, Any],
        output_path: str,
        format: str = 'json'
    ):
        """Save extraction results to file"""
        output_path = Path(output_path)
        
        if format == 'json':
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False, default=str)
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        print(f"Results saved to: {output_path}")
    
    def find_similar_users(
        self,
        current_user_id: str,
        current_user_missions: list,
        all_users: list,
        all_user_missions: dict
    ) -> Dict[str, Any]:
        """
        Find users with similar daily missions for lobby recommendations
        
        Returns:
            Dictionary with matched users and recommendations
        """
        matches = self.user_matcher.find_matching_users(
            current_user_id,
            current_user_missions,
            all_users,
            all_user_missions
        )
        
        recommendations = self.user_matcher.create_lobby_recommendations(matches)
        
        return {
            'matches': matches,
            'recommendations': recommendations,
            'total_matches': len(matches)
        }


if __name__ == '__main__':
    # Example usage
    extractor = PDFTreatmentPlanExtractor()
    
    # Process a PDF
    # results = extractor.process_pdf(
    #     pdf_path='example_treatment_plan.pdf',
    #     patient_id='patient-123',
    #     treatment_plan_id='plan-456',
    #     start_date=date.today()
    # )
    
    # Save results
    # extractor.save_results(results, 'extraction_results.json')
    
    print("PDF Treatment Plan Extractor initialized")
    print("Usage:")
    print("  extractor = PDFTreatmentPlanExtractor()")
    print("  results = extractor.process_pdf('path/to/plan.pdf', ...)")
    print("  extractor.save_results(results, 'output.json')")

