# FilmFetch Pro - Professional Movie Scraper

A sophisticated, professional-grade web application for scraping and managing action movies from HDMovie2. Built with modern web technologies and featuring a beautiful, responsive interface.

![FilmFetch Pro](https://img.shields.io/badge/FilmFetch-Pro-blue?style=for-the-badge&logo=film)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-red?style=for-the-badge&logo=fastapi)
![Selenium](https://img.shields.io/badge/Selenium-4.0+-orange?style=for-the-badge&logo=selenium)

## ✨ Features

### 🎯 Core Functionality
- **Automated Movie Scraping**: Extract action movies from HDMovie2 with intelligent data parsing
- **Real-time Data Processing**: Process and display scraped data instantly
- **CSV Export**: Export movie data to CSV format for external analysis
- **Advanced Filtering**: Search and sort movies by name, rating, and views

### 🎨 Professional UI/UX
- **Modern Design**: Clean, professional interface with gradient backgrounds and glassmorphism effects
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, smooth animations, and intuitive user interactions
- **Status Notifications**: Real-time feedback with color-coded status messages
- **Loading States**: Professional loading indicators and progress feedback

### 🔧 Technical Features
- **Pagination**: Efficient pagination system for large datasets
- **Keyboard Shortcuts**: Professional keyboard shortcuts for power users
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Validation**: Robust data validation and fallback mechanisms
- **Performance Optimized**: Efficient rendering and data processing

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Chrome browser (for Selenium WebDriver)
- Internet connection

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FilmFetch-Automation
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

4. **Access the web interface**
   Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
FilmFetch-Automation/
├── main.py                 # FastAPI server entry point
├── scraper.py             # Core scraping logic
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── action_movies_data.csv # Scraped data output
├── static/               # Frontend assets
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Professional styling
│   └── app.js          # JavaScript functionality
└── __pycache__/         # Python cache files
```

## 🎮 Usage Guide

### Starting a Scrape
1. Click the **"Start Scraping"** button in the Scraping Actions section
2. Wait for the scraping process to complete (progress will be shown)
3. View the scraped movies in the Movie Collection section

### Managing Data
- **Refresh Data**: Click "Refresh Data" to reload existing scraped data
- **Export CSV**: Click "Export CSV" to download the movie data
- **Search**: Use the search box to filter movies by name or rating
- **Sort**: Use the dropdown to sort movies by name, rating, or views

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Start scraping
- `Ctrl/Cmd + R`: Refresh data
- `Ctrl/Cmd + E`: Export CSV

## 🛠️ Technical Architecture

### Backend (Python/FastAPI)
- **FastAPI**: Modern, fast web framework for building APIs
- **Selenium**: Automated web scraping with Chrome WebDriver
- **BeautifulSoup**: HTML parsing and data extraction
- **CSV Processing**: Data export functionality

### Frontend (HTML/CSS/JavaScript)
- **Vanilla JavaScript**: Modern ES6+ JavaScript with classes and async/await
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Animations**: Smooth transitions and hover effects
- **Font Awesome**: Professional iconography

### Key Components
- **MovieScraperApp Class**: Main application logic
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error management
- **Data Processing**: Efficient filtering and sorting

## 🎨 Design Features

### Visual Design
- **Color Scheme**: Professional purple gradient theme
- **Typography**: Inter font family for modern readability
- **Icons**: Font Awesome icons for consistent visual language
- **Shadows**: Subtle shadows for depth and hierarchy

### User Experience
- **Loading States**: Clear feedback during operations
- **Status Messages**: Color-coded success, error, and info messages
- **Hover Effects**: Interactive feedback on buttons and cards
- **Smooth Animations**: Fade-in effects and transitions

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface
- **Tablet Support**: Optimized for medium screens
- **Desktop Experience**: Full-featured desktop interface

## 🔧 Configuration

### Scraping Settings
The scraper is configured to:
- Scrape 3 pages of action movies
- Extract movie name, image URL, link, rating, and views
- Handle missing data gracefully
- Use headless Chrome for efficient scraping

### Performance Settings
- **Items per page**: 12 movies per page
- **Search debouncing**: Real-time search filtering
- **Image fallbacks**: Placeholder images for missing movie posters

## 📊 Data Structure

Each scraped movie contains:
```json
{
  "name": "Movie Title",
  "img_url": "https://hdmovie2.fi/image.jpg",
  "link": "https://hdmovie2.fi/movie-link",
  "year": "2023",
  "rating": "8.5/10",
  "views": "1.2K views"
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Network Errors**: Graceful handling of connection issues
- **Parsing Errors**: Fallback mechanisms for malformed data
- **Missing Data**: Default values for incomplete information
- **User Feedback**: Clear error messages and status updates

## 🔒 Legal Notice

This tool is for educational and research purposes only. Please ensure compliance with:
- Website terms of service
- Robots.txt guidelines
- Rate limiting policies
- Copyright laws

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Bug fixes
- Feature enhancements
- UI/UX improvements
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**FilmFetch Pro** - Professional movie scraping made simple and beautiful. 
