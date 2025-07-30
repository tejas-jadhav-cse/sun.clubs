// BRUTE FORCE CATEGORY FIX FOR MOBILE
console.log('Loading category fix...');

const clubsByCategory = {
    'tech': ['sect-chapter', 'cyberx', 'leads-community', 'innovators-club', 'science-club', 'aeromodeling-club', 'esports-club', 'act-club', 'webmasters-club', 'astronomy-club', 'mathematics-club', 'ml-ai-robotics-club', 'apps-bloggers-club', 'energy-club'],
    'libarts': ['dance-club', 'photography-club', 'literary-drama-club', 'painting-art-club', 'music-club', 'quiz-debate-club', 'movie-club', 'culinary-club', 'talk-club'],
    'civicside': ['event-club', 'media-club', 'helping-hand-club', 'youth-empowerment-club', 'women-empowerment-club', 'ecological-club', 'fitness-club'],
    'xcape': ['cycling-club', 'trekking-club']
};

function forceShowCategory(categoryName) {
    console.log('=== FORCING CATEGORY:', categoryName, '===');
    
    // 1. Update buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === categoryName);
    });
    
    // 2. Update sidebar tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.toggle('active', tab.id === categoryName + '-content');
    });
    
    // 3. FORCE show/hide content groups
    const clubsToShow = clubsByCategory[categoryName] || [];
    document.querySelectorAll('.content-group').forEach(group => {
        const shouldShow = clubsToShow.includes(group.id);
        
        if (shouldShow) {
            // MAXIMUM FORCE SHOW
            group.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            group.removeAttribute('hidden');
            group.classList.add('force-visible');
            console.log('SHOWING:', group.id);
        } else {
            // MAXIMUM FORCE HIDE  
            group.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            group.setAttribute('hidden', 'true');
            group.classList.remove('force-visible');
            console.log('HIDING:', group.id);
        }
    });
    
    // 4. Update first sidebar item
    const activeTab = document.getElementById(categoryName + '-content');
    if (activeTab) {
        const items = activeTab.querySelectorAll('.sidebar-item');
        items.forEach(item => item.classList.remove('active'));
        if (items[0]) items[0].classList.add('active');
    }
}

// Wait for DOM and initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, setting up category fix...');
    
    // Remove existing listeners first
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.removeEventListener('click', arguments.callee);
    });
    
    // Add button listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const cat = this.getAttribute('data-category');
            console.log('CLICKED:', cat);
            forceShowCategory(cat);
        });
    });
    
    // Force initialize with tech after delay
    setTimeout(() => {
        console.log('INITIALIZING WITH TECH...');
        forceShowCategory('tech');
    }, 1000);
});

// Also try immediate initialization
if (document.readyState === 'complete') {
    setTimeout(() => {
        forceShowCategory('tech');
    }, 500);
}
