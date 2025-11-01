# API Integration Guide

This document explains how to integrate the PDF extraction system with your FastAPI backend.

## FastAPI Endpoint Implementation

### 1. Upload and Process PDF

```python
from fastapi import APIRouter, UploadFile, File, HTTPException
from pdf_extraction.main_extractor import PDFTreatmentPlanExtractor
from datetime import date

router = APIRouter(prefix="/api/treatment-plans", tags=["treatment-plans"])

@router.post("/upload")
async def upload_treatment_plan(
    file: UploadFile = File(...),
    patient_id: str,
    start_date: Optional[str] = None,
    default_points: int = 50
):
    """
    Upload and process treatment plan PDF
    
    Returns:
        - treatment_plan_id: Created treatment plan ID
        - missions_created: Number of missions generated
        - extraction_results: Full extraction data
    """
    # Save uploaded file temporarily
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Initialize extractor
    extractor = PDFTreatmentPlanExtractor()
    
    # Process PDF
    start_date_obj = date.fromisoformat(start_date) if start_date else date.today()
    
    try:
        results = extractor.process_pdf(
            pdf_path=temp_path,
            patient_id=patient_id,
            treatment_plan_id=None,  # Will be created after PDF processing
            start_date=start_date_obj,
            default_points=default_points
        )
        
        # Save PDF to Supabase Storage
        pdf_url = await upload_to_storage(temp_path, file.filename)
        
        # Create treatment plan in database
        treatment_plan = await create_treatment_plan(
            patient_id=patient_id,
            pdf_url=pdf_url,
            title=extract_title_from_results(results),
            metadata=results['metadata']
        )
        
        # Create treatment plan sections
        for section in results['extracted_data'].get('sections', []):
            await create_treatment_plan_section(
                treatment_plan_id=treatment_plan['id'],
                section_data=section
            )
        
        # Create missions
        mission_ids = []
        for mission in results['missions']:
            mission['treatment_plan_id'] = treatment_plan['id']
            created_mission = await create_mission(mission)
            mission_ids.append(created_mission['id'])
            
            # Update mission_id in calendar events
            if mission in results.get('calendar_events', []):
                event = results['calendar_events'][mission_idx]
                event['mission_id'] = created_mission['id']
        
        # Create calendar events
        for event in results['calendar_events']:
            await create_calendar_event(event)
        
        return {
            "treatment_plan_id": treatment_plan['id'],
            "missions_created": len(mission_ids),
            "calendar_events_created": len(results['calendar_events']),
            "extraction_metadata": results['metadata']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")
    finally:
        # Clean up temp file
        os.remove(temp_path)
```

### 2. Find Matching Users (Lobby Recommendations)

```python
@router.get("/api/users/{user_id}/lobby-recommendations")
async def get_lobby_recommendations(
    user_id: str,
    limit: int = 5
):
    """
    Get lobby recommendations for users with similar daily missions
    """
    from pdf_extraction.user_matcher import UserMatcher
    
    matcher = UserMatcher()
    
    # Get current user's missions
    current_user_missions = await get_user_missions(user_id)
    
    # Get all users and their missions
    all_users = await get_all_patients()
    all_user_missions = {}
    
    for user in all_users:
        user_missions = await get_user_missions(user['id'])
        all_user_missions[user['id']] = user_missions
    
    # Find matches
    matches = matcher.find_matching_users(
        current_user_id=user_id,
        current_user_missions=current_user_missions,
        all_users=all_users,
        all_user_missions=all_user_missions
    )
    
    # Generate recommendations
    recommendations = matcher.create_lobby_recommendations(matches, limit)
    
    return {
        "recommendations": recommendations,
        "total_matches": len(matches)
    }
```

### 3. Batch Process Existing Plans

```python
@router.post("/api/treatment-plans/{plan_id}/reprocess")
async def reprocess_treatment_plan(
    plan_id: str,
    update_existing: bool = False
):
    """
    Reprocess an existing treatment plan PDF
    Useful if extraction logic has improved
    """
    # Get treatment plan
    plan = await get_treatment_plan(plan_id)
    
    # Download PDF from storage
    pdf_path = await download_from_storage(plan['pdf_url'])
    
    # Process
    extractor = PDFTreatmentPlanExtractor()
    results = extractor.process_pdf(
        pdf_path=pdf_path,
        patient_id=plan['patient_id'],
        treatment_plan_id=plan_id
    )
    
    if update_existing:
        # Update missions
        await update_missions_from_extraction(results['missions'])
    
    return results
```

## Database Helpers

```python
async def create_treatment_plan(
    patient_id: str,
    pdf_url: str,
    title: str,
    metadata: dict
) -> dict:
    """Create treatment plan in database"""
    # SQL: INSERT INTO treatment_plans ...
    pass

async def create_mission(mission_data: dict) -> dict:
    """Create mission in database"""
    # SQL: INSERT INTO missions ...
    pass

async def create_calendar_event(event_data: dict) -> dict:
    """Create calendar event in database"""
    # SQL: INSERT INTO calendar_events ...
    pass

async def get_user_missions(user_id: str, date_filter: Optional[date] = None) -> list:
    """Get user's missions, optionally filtered by date"""
    # SQL: SELECT * FROM missions WHERE patient_id = ...
    pass
```

## Real-time Updates

Use WebSocket or Server-Sent Events to notify users when:
- New missions are created from PDF import
- Matching users are found for lobby recommendations
- Calendar events are synchronized

```python
from fastapi import WebSocket

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    
    # Send lobby recommendations when available
    recommendations = await get_lobby_recommendations(user_id)
    await websocket.send_json({
        "type": "lobby_recommendations",
        "data": recommendations
    })
```

## Error Handling

```python
class PDFExtractionError(Exception):
    pass

class InvalidPDFError(PDFExtractionError):
    pass

class ExtractionFailedError(PDFExtractionError):
    pass

# In endpoint
try:
    results = extractor.process_pdf(...)
except FileNotFoundError:
    raise HTTPException(404, "PDF file not found")
except Exception as e:
    raise HTTPException(500, f"Extraction failed: {str(e)}")
```

