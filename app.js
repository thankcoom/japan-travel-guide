class TravelHandbook {
    constructor() {
        this.currentPage = 0;
        this.pages = document.querySelectorAll('.page');
        this.totalPages = this.pages.length;
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentPageSpan = document.querySelector('.current-page');
        this.totalPagesSpan = document.querySelector('.total-pages');
        
        this.init();
    }
    
    init() {
        this.updateUI();
        this.attachEventListeners();
        this.loadChecklistState();
        
        // Initialize page indicators
        if (this.totalPagesSpan) {
            this.totalPagesSpan.textContent = this.totalPages;
        }
        
        console.log('📖 旅遊手札已載入');
    }
    
    attachEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousPage());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextPage());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextPage();
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Checklist functionality
        this.initChecklist();
    }
    
    previousPage() {
        if (this.currentPage > 0) {
            this.goToPage(this.currentPage - 1);
            this.playPageFlipSound();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.goToPage(this.currentPage + 1);
            this.playPageFlipSound();
        }
    }
    
    goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        
        // Remove active class from current page
        this.pages[this.currentPage].classList.remove('active');
        this.pages[this.currentPage].classList.add('prev');
        
        // Add active class to new page
        this.currentPage = pageIndex;
        this.pages[this.currentPage].classList.remove('prev');
        this.pages[this.currentPage].classList.add('active');
        
        // Clean up prev class after transition
        setTimeout(() => {
            this.pages.forEach(page => page.classList.remove('prev'));
        }, 600);
        
        this.updateUI();
    }
    
    updateUI() {
        // Update page indicator
        if (this.currentPageSpan) {
            this.currentPageSpan.textContent = this.currentPage + 1;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentPage === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next page
                    this.nextPage();
                } else {
                    // Swipe right - previous page
                    this.previousPage();
                }
            }
        });
    }
    
    initChecklist() {
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                const label = checkbox.closest('.checklist-item');
                const span = label.querySelector('span');
                
                if (checkbox.checked) {
                    span.style.textDecoration = 'line-through';
                    span.style.opacity = '0.6';
                    label.style.background = 'var(--handbook-teal)';
                    label.style.color = 'white';
                    label.style.borderRadius = '8px';
                    
                    // Add checkmark animation
                    this.showCheckAnimation(label);
                } else {
                    span.style.textDecoration = 'none';
                    span.style.opacity = '1';
                    label.style.background = 'transparent';
                    label.style.color = 'var(--handbook-text)';
                }
                
                // Save state
                this.saveChecklistState();
            });
        });
    }
    
    showCheckAnimation(element) {
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: absolute;
            right: -30px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--handbook-teal);
            font-size: 18px;
            font-weight: bold;
            animation: checkPop 0.5s ease;
        `;
        
        // Add animation styles if not exists
        if (!document.querySelector('#check-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'check-animation-styles';
            style.textContent = `
                @keyframes checkPop {
                    0% { opacity: 0; transform: translateY(-50%) scale(0); }
                    50% { opacity: 1; transform: translateY(-50%) scale(1.3); }
                    100% { opacity: 1; transform: translateY(-50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.appendChild(checkmark);
        
        setTimeout(() => {
            if (checkmark.parentNode) {
                checkmark.parentNode.removeChild(checkmark);
            }
        }, 2000);
    }
    
    saveChecklistState() {
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const states = Array.from(checkboxes).map(cb => cb.checked);
        localStorage.setItem('handbook-checklist', JSON.stringify(states));
    }
    
    loadChecklistState() {
        const saved = localStorage.getItem('handbook-checklist');
        if (saved) {
            const states = JSON.parse(saved);
            const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
            
            checkboxes.forEach((checkbox, index) => {
                if (states[index]) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }
    }
    
    playPageFlipSound() {
        // Create subtle page flip sound effect
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const audioContext = new (AudioContext || webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // Silent fail if audio context not available
            }
        }
    }
}

// Global functions for inline event handlers
function previousPage() {
    if (window.handbook) {
        window.handbook.previousPage();
    }
}

function nextPage() {
    if (window.handbook) {
        window.handbook.nextPage();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.handbook = new TravelHandbook();
    
    // Add click-to-copy functionality for important information
    const flightNumbers = document.querySelectorAll('.airline');
    flightNumbers.forEach(element => {
        element.style.cursor = 'pointer';
        element.title = '點擊複製';
        
        element.addEventListener('click', () => {
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const original = element.textContent;
                element.textContent = '已複製!';
                element.style.color = 'var(--handbook-teal)';
                
                setTimeout(() => {
                    element.textContent = original;
                    element.style.color = '';
                }, 1500);
            });
        });
    });
    
    // Add print functionality
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
    
    console.log('📖 日本旅遊手札已完全載入！');
    console.log('🍂 使用 ← → 箭頭鍵或觸摸滑動來翻頁');
    console.log('✅ 清單項目會自動儲存');
});