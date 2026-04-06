from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from bson import ObjectId
from services.parser_service import parse_resume
from services.ai_service import evaluate_resume

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("/resume")
async def analyze_resume(request: Request, file: UploadFile = File(...), role: str = Form(...)):
    try:
        contents = await file.read()
        parsed_text = parse_resume(contents, file.filename)
        
        evaluation = evaluate_resume(parsed_text, role)
        
        # Save to DB
        document = {
            "filename": file.filename,
            "target_role": role,
            "evaluation": evaluation
        }
        
        db = request.app.mongodb
        result = await db["evaluations"].insert_one(document)
        
        return {"id": str(result.inserted_id), "message": "Analysis successful"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Server Error: {e}")
        # Return the actual error message to help debugging
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")


@router.get("/results/{id}")
async def get_results(request: Request, id: str):
    try:
        db = request.app.mongodb
        document = await db["evaluations"].find_one({"_id": ObjectId(id)})
        if not document:
            raise HTTPException(status_code=404, detail="Result not found")
        
        document["_id"] = str(document["_id"])
        return document
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ID format")
