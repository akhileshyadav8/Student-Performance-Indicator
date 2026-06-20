from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.pipeline.predict_pipeline import CustomData, PredictPipeline

app = FastAPI(title="Maths Score Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentInput(BaseModel):
    gender: str
    race_ethnicity: str = Field(alias="raceEthnicity")
    parental_level_of_education: str = Field(alias="parentalEducation")
    lunch: str
    test_preparation_course: str = Field(alias="testPreparationCourse")
    reading_score: float = Field(alias="readingScore", ge=0, le=100)
    writing_score: float = Field(alias="writingScore", ge=0, le=100)

    class Config:
        populate_by_name = True


@app.get("/")
def read_index():
    return {"message": "Maths Score Predictor API is running."}


@app.post("/predictdata")
def predict_datapoint(student: StudentInput):
    custom_data = CustomData(
        gender=student.gender,
        race_ethnicity=student.race_ethnicity,
        parental_level_of_education=student.parental_level_of_education,
        lunch=student.lunch,
        test_preparation_course=student.test_preparation_course,
        reading_score=student.reading_score,
        writing_score=student.writing_score,
    )

    pred_df = custom_data.get_data_as_data_frame()
    prediction = PredictPipeline().predict(pred_df)

    return {
        "predicted_maths_score": round(float(prediction[0]), 2),
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
