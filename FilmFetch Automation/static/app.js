/**
 * FilmFetch Pro - Professional Movie Scraper Application
 * Main JavaScript functionality for the web interface
 */

class MovieScraperApp {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isScraping = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadMovies();
    }

    initializeElements() {
        this.scrapeBtn = document.getElementById('scrapeBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.searchBox = document.getElementById('searchBox');
        this.sortSelect = document.getElementById('sortSelect');
        this.moviesContainer = document.getElementById('moviesContainer');
        this.statusSection = document.getElementById('statusSection');
        this.statusMessage = document.getElementById('statusMessage');
        this.pagination = document.getElementById('pagination');
        this.totalMoviesEl = document.getElementById('totalMovies');
        this.lastUpdateEl = document.getElementById('lastUpdate');
    }

    bindEvents() {
        this.scrapeBtn.addEventListener('click', () => this.startScraping());
        this.refreshBtn.addEventListener('click', () => this.loadMovies());
        this.exportBtn.addEventListener('click', () => this.exportCSV());
        this.searchBox.addEventListener('input', () => this.filterMovies());
        this.sortSelect.addEventListener('change', () => this.filterMovies());
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.startScraping();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.loadMovies();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportCSV();
                        break;
                }
            }
        });
    }

    showStatus(message, type = 'info') {
        this.statusSection.style.display = 'block';
        this.statusMessage.className = `status-message status-${type}`;
        this.statusMessage.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                this.statusSection.style.display = 'none';
            }, 5000);
        }
    }

    setLoading(loading) {
        this.isScraping = loading;
        this.scrapeBtn.disabled = loading;
        this.refreshBtn.disabled = loading;
        
        if (loading) {
            this.scrapeBtn.innerHTML = '<div class="loading-spinner"></div><span>Scraping...</span>';
        } else {
            this.scrapeBtn.innerHTML = '<i class="fas fa-download"></i><span>Start Scraping</span>';
        }
    }

    async startScraping() {
        if (this.isScraping) return;
        
        this.setLoading(true);
        this.showStatus('Initializing scraping process...', 'info');
        
        try {
            const response = await fetch('/scrape', { method: 'POST' });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Scraping failed');
            }
            
            this.movies = data.movies || [];
            this.updateStats();
            this.filterMovies();
            this.showStatus(`Successfully scraped ${data.count} movies!`, 'success');
            
        } catch (error) {
            console.error('Scraping error:', error);
            this.showStatus(`Scraping failed: ${error.message}`, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async loadMovies() {
        try {
            this.showStatus('Loading movies...', 'info');
            const response = await fetch('/movies');
            if (response.ok) {
                this.movies = await response.json();
                this.updateStats();
                this.filterMovies();
                this.showStatus('Movies loaded successfully', 'success');
            } else {
                const error = await response.json();
                this.showStatus(error.detail || 'Failed to load movies', 'error');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.showStatus('Failed to load movies', 'error');
        }
    }

    filterMovies() {
        const searchTerm = this.searchBox.value.toLowerCase();
        const sortBy = this.sortSelect.value;
        
        this.filteredMovies = this.movies.filter(movie => 
            movie.name.toLowerCase().includes(searchTerm) ||
            movie.rating.toLowerCase().includes(searchTerm)
        );
        
        // Sort movies
        this.filteredMovies.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return this.extractRating(b.rating) - this.extractRating(a.rating);
                case 'views':
                    return this.extractViews(b.views) - this.extractViews(a.views);
                default:
                    return a.name.localeCompare(b.name);
            }
        });
        
        this.currentPage = 1;
        this.renderMovies();
        this.renderPagination();
    }

    extractRating(ratingStr) {
        const match = ratingStr.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    extractViews(viewsStr) {
        const match = viewsStr.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    renderMovies() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMovies = this.filteredMovies.slice(startIndex, endIndex);
        
        if (pageMovies.length === 0) {
            this.moviesContainer.innerHTML = `
                <div class="empty-state fade-in">
                    <i class="fas fa-search"></i>
                    <h3>No Movies Found</h3>
                    <p>Try adjusting your search criteria or start scraping</p>
                </div>
            `;
            return;
        }
        
        this.moviesContainer.innerHTML = `
            <div class="movies-grid fade-in">
                ${pageMovies.map(movie => this.renderMovieCard(movie)).join('')}
            </div>
        `;
    }

    renderMovieCard(movie) {
        const rating = this.extractRating(movie.rating);
        const ratingColor = rating >= 7 ? '#10b981' : rating >= 5 ? '#f59e0b' : '#ef4444';
        
        return `
            <div class="movie-card">
                <div class="movie-image">
                    <img src="${movie.img_url}" alt="${movie.name}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                    <div class="movie-overlay">
                        <a href="${movie.link}" target="_blank" class="btn btn-primary btn-sm">
                            <i class="fas fa-play"></i> Watch
                        </a>
                    </div>
                </div>
                <div class="movie-content">
                    <h3 class="movie-title">${movie.name}</h3>
                    <div class="movie-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span style="color: ${ratingColor};">${movie.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-eye"></i>
                            <span>${movie.views}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${movie.year}</span>
                        </div>
                    </div>
                    <div class="movie-actions">
                        <a href="${movie.link}" target="_blank" class="btn btn-primary btn-sm">
                            <i class="fas fa-external-link-alt"></i> View
                        </a>
                        <button class="btn btn-secondary btn-sm" onclick="this.copyMovieLink('${movie.link}')">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async copyMovieLink(link) {
        try {
            await navigator.clipboard.writeText(link);
            this.showStatus('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy link:', error);
            this.showStatus('Failed to copy link', 'error');
        }
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredMovies.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        }
        
        this.pagination.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="app.goToPage(${i})">${i}</button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span class="page-btn">...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        this.pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredMovies.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderMovies();
            this.renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateStats() {
        this.totalMoviesEl.textContent = this.movies.length;
        this.lastUpdateEl.textContent = new Date().toLocaleTimeString();
    }

    exportCSV() {
        if (this.movies.length === 0) {
            this.showStatus('No movies to export', 'error');
            return;
        }
        
        const headers = ['Name', 'Image URL', 'Link', 'Year', 'Rating', 'Views'];
        const csvContent = [
            headers.join(','),
            ...this.movies.map(movie => [
                `"${movie.name}"`,
                `"${movie.img_url}"`,
                `"${movie.link}"`,
                `"${movie.year}"`,
                `"${movie.rating}"`,
                `"${movie.views}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `movies_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showStatus('CSV exported successfully', 'success');
    }

    // Utility methods
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MovieScraperApp();
});

// Add global utility functions
window.copyMovieLink = function(link) {
    if (window.app) {
        window.app.copyMovieLink(link);
    }
}; 