"""
Example usage of the PDF Treatment Plan Extractor

This script demonstrates how to use the extraction pipeline to:
1. Extract data from treatment plan PDFs
2. Generate missions and calendar events
3. Find matching users for lobby recommendations
"""

from main_extractor import PDFTreatmentPlanExtractor
from datetime import date
import json


def main():
    """Example usage"""
    
    # Initialize extractor
    print("Initializing PDF Treatment Plan Extractor...")
    extractor = PDFTreatmentPlanExtractor(nlp_model='en_core_web_sm')
    
    # Example: Process a treatment plan PDF
    pdf_path = "example_treatment_plan.pdf"  # Replace with actual PDF path
    patient_id = "patient-123"
    treatment_plan_id = "plan-456"
    start_date = date.today()
    
    print(f"\nProcessing PDF: {pdf_path}")
    
    try:
        # Step 1: Process PDF and extract data
        results = extractor.process_pdf(
            pdf_path=pdf_path,
            patient_id=patient_id,
            treatment_plan_id=treatment_plan_id,
            start_date=start_date,
            default_points=50
        )
        
        # Step 2: Save results
        output_path = "extraction_results.json"
        extractor.save_results(results, output_path)
        print(f"\nResults saved to: {output_path}")
        
        # Step 3: Display summary
        print("\n" + "="*50)
        print("EXTRACTION SUMMARY")
        print("="*50)
        print(f"Exercises extracted: {len(results['extracted_data']['exercises'])}")
        print(f"Missions generated: {len(results['missions'])}")
        print(f"Calendar events generated: {len(results['calendar_events'])}")
        print(f"Confidence: {results['metadata']['confidence']:.2%}")
        
        # Step 4: Display sample missions
        print("\n" + "="*50)
        print("SAMPLE MISSIONS (First 5)")
        print("="*50)
        for i, mission in enumerate(results['missions'][:5], 1):
            print(f"\n{i}. {mission['title']}")
            print(f"   Type: {mission['mission_type']}")
            print(f"   Date: {mission['scheduled_date']}")
            print(f"   Time: {mission['scheduled_time']}")
            print(f"   Points: {mission['points']}")
        
        # Step 5: Example of finding matching users
        print("\n" + "="*50)
        print("FINDING MATCHING USERS")
        print("="*50)
        
        # Mock data for example
        all_users = [
            {
                'id': 'user-2',
                'full_name': 'Jane Doe',
                'patient_profile': {'injury_type': 'Right Shoulder - Strength'}
            },
            {
                'id': 'user-3',
                'full_name': 'Bob Smith',
                'patient_profile': {'injury_type': 'Neck - Range of Motion'}
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
            ],
            'user-3': [
                {
                    'title': 'Neck Retractions',
                    'mission_type': 'exercise',
                    'scheduled_date': date.today().isoformat(),
                    'description': 'Neck posture exercise'
                }
            ]
        }
        
        matches = extractor.find_similar_users(
            current_user_id=patient_id,
            current_user_missions=results['missions'],
            all_users=all_users,
            all_user_missions=all_user_missions
        )
        
        print(f"Found {matches['total_matches']} matching users")
        print(f"\nRecommendations:")
        for rec in matches['recommendations']:
            print(f"  - {rec['user_name']}: {rec['lobby_suggestion']}")
            print(f"    Similarity: {rec['similarity_score']:.2%}")
            print(f"    Common missions: {rec['common_mission_count']}")
        
    except FileNotFoundError:
        print(f"Error: PDF file not found: {pdf_path}")
        print("\nTo use this script:")
        print("1. Place a treatment plan PDF in the pdf-extraction directory")
        print("2. Update pdf_path variable with the filename")
        print("3. Run the script again")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()

