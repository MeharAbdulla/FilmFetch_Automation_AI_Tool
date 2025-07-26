from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from scraper import scrape_action_movies
import csv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

latest_movies = []
CSV_FILE = "action_movies_data.csv"

@app.get("/")
def root():
    return RedirectResponse(url="/static/")

@app.post("/scrape")
def scrape():
    global latest_movies
    try:
        latest_movies = scrape_action_movies()
        if not latest_movies:
            raise HTTPException(status_code=404, detail="No movies found during scraping.")
        with open(CSV_FILE, mode="w", newline='', encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=latest_movies[0].keys())
            writer.writeheader()
            writer.writerows(latest_movies)
        return {"status": "success", "count": len(latest_movies), "movies": latest_movies}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

@app.get("/movies")
def get_movies():
    if not latest_movies:
        raise HTTPException(status_code=404, detail="No movies available. Please scrape first.")
    return latest_movies 