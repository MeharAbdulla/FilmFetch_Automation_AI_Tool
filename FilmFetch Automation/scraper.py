from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup, Tag
import time
import csv

def scrape_action_movies():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.265 Safari/537.36"
    )
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    output_file = "action_movies_data.csv"
    movies = []

    for page in range(1, 4):
        print(f"Scraping Action movies - Page {page}...")
        if page == 1:
            url = "https://hdmovie2.fi/action/"
        else:
            url = f"https://hdmovie2.fi/action/page/{page}/"
        driver.get(url)
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME, "items"))
            )
        except Exception as e:
            print(f"Page {page} did not load properly: {e}")
            continue
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        movies_section = soup.find("div", class_="items normal")
        if not isinstance(movies_section, Tag):
            print(f"⚠️ 'items normal' section not found on page {page}")
            continue
        movie_items = movies_section.find_all("article", class_="item movies") if isinstance(movies_section, Tag) else []
        if not movie_items:
            print(f"⚠️ No movie items found on page {page}")
            continue
        for movie in movie_items:
            if not isinstance(movie, Tag):
                continue
            name_tag = movie.find("a")
            name = name_tag.text.strip() if isinstance(name_tag, Tag) and name_tag.text else "Unknown"
            img_tag = movie.find("img")
            img_url = (
                "https://hdmovie2.fi" + str(img_tag["src"])
                if isinstance(img_tag, Tag) and img_tag.has_attr("src") and isinstance(img_tag["src"], str)
                else "No Image"
            )
            link = name_tag["href"] if isinstance(name_tag, Tag) and name_tag.has_attr("href") else "No Link"
            rating_tag = movie.find("div", class_="rating")
            rating = rating_tag.text.strip() if isinstance(rating_tag, Tag) and rating_tag.text else "No Rating"
            views_tag = movie.find("div", class_="data")
            views = views_tag.text.strip() if isinstance(views_tag, Tag) and views_tag.text else "No Views"
            year = "Unknown"
            movies.append({
                "name": name,
                "img_url": img_url,
                "link": link,
                "year": year,
                "rating": rating,
                "views": views
            })
        time.sleep(2)
    driver.quit()
    # Write to CSV
    if movies:
        with open(output_file, "w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=movies[0].keys())
            writer.writeheader()
            writer.writerows(movies)
    print(f"✅ Scraping completed. Data saved in {output_file}")
    return movies
