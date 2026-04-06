from openai import OpenAI
from core.config import settings
import json

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENAI_API_KEY
) if settings.OPENAI_API_KEY else None

def evaluate_resume(resume_text: str, target_role: str) -> dict:
    if not client:
        # Fallback for dev without API key
        return {
            "score": 85,
            "ats_compatibility": 80,
            "strengths": ["Python", "Machine Learning (simulated response)", "Data Analysis"],
            "weaknesses": ["Cloud deployment", "CI/CD pipelines"],
            "skill_gaps": ["AWS", "Docker", "Kubernetes"],
            "suggestions": [
                "Add more quantifiable achievements in your previous roles.",
                "Highlight specific projects matching the target role.",
                "Ensure standard formatting for Applicant Tracking Systems."
            ],
            "roadmap": {
                "0-3 months": ["Learn Docker basics", "Build a simple containerized web app"],
                "3-6 months": ["Learn AWS fundamentals (EC2, S3, RDS)", "Deploy your web app to AWS"],
                "6-12 months": ["Learn Kubernetes for orchestration", "Study CI/CD with GitHub Actions"]
            }
        }
    
    prompt = f"""
    You are an expert AI Resume Screener and Career Advisor.
    Analyze the following resume text for the target role of "{target_role}".
    Provide a detailed JSON response strictly following this structure:
    {{
        "score": <0-100 integer>,
        "ats_compatibility": <0-100 integer>,
        "strengths": [<list of strings>],
        "weaknesses": [<list of strings>],
        "skill_gaps": [<list of strings>],
        "suggestions": [<list of strings>],
        "roadmap": {{
            "0-3 months": [<list of strings>],
            "3-6 months": [<list of strings>],
            "6-12 months": [<list of strings>]
        }}
    }}
    
    Resume Text:
    {resume_text}
    """
    
    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.6-plus:free",
            messages=[
                {"role": "system", "content": "You output only structured JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        content = response.choices[0].message.content
        
        # Clean markdown wrappers if model outputs them
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Error calling OpenRouter API: {e}")
        raise ValueError("Failed to evaluate resume using AI.")
