import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayerPage } from './components/VideoPlayerPage';
import { videoService } from './services/videoService';
import { Video, Page, Suggestion } from './types';
import { useWindowSize } from './hooks/useWindowSize';
import { Footer } from './components/Footer';
import { BottomNavBar } from './components/BottomNavBar';
import { CategoryFilters } from './components/CategoryFilters';
import { SuggestionsSection } from './components/SuggestionsSection';
import { SearchPage } from './components/SearchPage';
import { NotificationsPage } from './components/NotificationsPage';
import { VideoPlayerPageLoader } from './components/VideoPlayerPageLoader';
import { TrendingPage } from './components/TrendingPage';
import { FollowingPage } from './components/FollowingPage';
import { LibraryPage } from './components/LibraryPage';
import { CreateModal } from './components/CreateModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { Toast } from './components/Toast';

const CATEGORIES = ['All', 'Trending', 'Gaming', 'Music', 'Coding', 'Design', 'Travel', 'Cooking', 'Health', 'Technology'];

function App() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { width } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to collapsed on all screens
  const [activeCategory, setActiveCategory] = useState('All');
  const [pageKey, setPageKey] = useState('home-All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [paginationPage, setPaginationPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);

  const [activePage, setActivePage] = useState<Page>('home');

  // Modal states
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const items = window.localStorage.getItem('recentSearches');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Failed to parse recent searches from localStorage', error);
      return [];
    }
  });

  const mainContentRef = useRef<HTMLElement>(null);


  useEffect(() => {
    // This effect now fetches all videos once for recommendations/player page context
    // The grid itself will use paginated fetching
    videoService.getVideos({ page: 1, limit: 100 }).then(data => {
      setAllVideos(data.videos);
    });
  }, []);

  useEffect(() => {
    // Effect to reset and fetch videos when filters change
    const fetchInitialVideos = async () => {
      setIsLoading(true);
      setVideos([]);
      setPaginationPage(1);
      const { videos: newVideos, hasMore: newHasMore } = await videoService.getVideos({
        page: 1,
        category: activeCategory,
        query: searchQuery
      });
      setVideos(newVideos);
      setHasMore(newHasMore);
      setIsLoading(false);
    };

    const searchDebounce = setTimeout(() => {
      if (activePage === 'home') {
        fetchInitialVideos();
      }
    }, 300); // Debounce search to avoid rapid API calls

    return () => clearTimeout(searchDebounce);
  }, [activeCategory, searchQuery, activePage]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const fetchSuggestions = async () => {
        const newSuggestions = await videoService.getSearchSuggestions(searchQuery);
        setSuggestions(newSuggestions);
      };
      
      const suggestionDebounce = setTimeout(() => {
        fetchSuggestions();
      }, 250);
      
      return () => clearTimeout(suggestionDebounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);
  
  const addRecentSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setRecentSearches(prevSearches => {
      const newSearches = [trimmedQuery, ...prevSearches.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase())].slice(0, 5);
      try {
        window.localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      } catch (error) {
        console.error('Failed to save recent searches to localStorage', error);
      }
      return newSearches;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to remove recent searches from localStorage', error);
    }
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const nextPage = paginationPage + 1;
    const { videos: newVideos, hasMore: newHasMore } = await videoService.getVideos({
      page: nextPage,
      category: activeCategory,
      query: searchQuery
    });

    setVideos(prevVideos => [...prevVideos, ...newVideos]);
    setPaginationPage(nextPage);
    setHasMore(newHasMore);
    setIsFetchingMore(false);
  }, [isFetchingMore, hasMore, paginationPage, activeCategory, searchQuery]);


  const handleSelectVideo = (video: Video) => {
    setIsSearchPageOpen(false);
    setIsPlayerLoading(true);
    setSelectedVideo(null);
    setActivePage('video');
    
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

     if (width < 768) {
      setIsSidebarOpen(false);
    }

    // Simulate fetching full video details
    videoService.getVideoById(video.id).then(fullVideo => {
        if (fullVideo) {
            setSelectedVideo(fullVideo);
            setPageKey(fullVideo.id);
        } else {
            console.error("Video not found, returning home.");
            handleGoHome();
        }
        setIsPlayerLoading(false);
    });
  };

  const changePage = (page: Page) => {
    setSelectedVideo(null);
    setIsPlayerLoading(false);
    setActivePage(page);
    setPageKey(page);
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (width < 768) setIsSidebarOpen(false);
  }

  const handleCategorySelect = (category: string) => {
    if (category === 'Trending') {
      changePage('trending');
    } else {
      setActiveCategory(category);
      if (searchQuery) setSearchQuery(''); // Clear search when changing category
      changePage('home');
      setPageKey(`home-${category}`);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSuggestions([]); // Close dropdown
    
    switch (suggestion.type) {
        case 'video':
            setSearchQuery(''); 
            handleSelectVideo(suggestion.video);
            break;
        case 'channel':
            setSearchQuery('');
            changePage('profile');
            break;
        case 'keyword':
            setSearchQuery('');
            handleCategorySelect(suggestion.keyword);
            break;
        case 'query':
            setSearchQuery(suggestion.query);
            addRecentSearch(suggestion.query);
            // The dropdown closes, and the useEffect for searchQuery will trigger a content refresh
            break;
    }
  };

  const handleGoHome = () => {
    if (searchQuery) setSearchQuery(''); // Clear search on home navigation
    if (activeCategory !== 'All') setActiveCategory('All');
    changePage('home');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const suggestionVideos = useMemo(() => {
    return [...allVideos].sort((a, b) => b.likes - a.likes).slice(0, 5);
  }, [allVideos]);

  const appPage = useMemo(() => {
    if (selectedVideo || isPlayerLoading) return 'video';
    return activePage;
  }, [selectedVideo, isPlayerLoading, activePage]);


  const renderContent = () => {
    if (isPlayerLoading) return <VideoPlayerPageLoader />;
    if (selectedVideo) {
      return (
        <VideoPlayerPage 
          video={selectedVideo} 
          allVideos={allVideos} 
          onSelectVideo={handleSelectVideo}
          onGoBack={handleGoHome}
        />
      );
    }
    
    switch(activePage) {
      case 'home':
        return (
          <div className="flex-1">
            <CategoryFilters 
              categories={CATEGORIES}
              selectedCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />
            {!searchQuery && activeCategory === 'All' && <SuggestionsSection videos={suggestionVideos} onSelectVideo={handleSelectVideo} />}
            <div className="px-4 md:px-6">
              <VideoGrid 
                videos={videos} 
                onSelectVideo={handleSelectVideo}
                isLoading={isLoading}
                loadMoreVideos={loadMoreVideos}
                hasMore={hasMore}
                isFetchingMore={isFetchingMore}
                scrollableRootRef={mainContentRef}
              />
            </div>
            {!selectedVideo && hasMore && videos.length > 0 && <Footer />}
          </div>
        );
      case 'trending':
        return <TrendingPage onSelectVideo={handleSelectVideo} />;
      case 'following':
        return <FollowingPage allVideos={allVideos} onSelectVideo={handleSelectVideo} />;
      case 'library':
        return <LibraryPage allVideos={allVideos} onSelectVideo={handleSelectVideo} />;
      case 'profile':
        return <ProfilePage allVideos={allVideos} onSelectVideo={handleSelectVideo} />;
      case 'settings':
        return <SettingsPage onGoBack={handleGoHome} onShowToast={showToast} />;
      case 'notifications':
        return <NotificationsPage onGoBack={handleGoHome} />;
      default:
        return null;
    }
  };

  const showChrome = !isSearchPageOpen && !['notifications', 'profile', 'settings'].includes(activePage);
  const showSidebar = !['profile', 'settings'].includes(activePage);
  const showHeader = showChrome && appPage !== 'video';

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
      {showHeader && (
        <Header 
          onLogoClick={handleGoHome} 
          onToggleSidebar={toggleSidebar} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          onOpenSearchPage={() => setIsSearchPageOpen(true)}
          onOpenNotificationsPage={() => changePage('notifications')}
          onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenProfilePage={() => changePage('profile')}
          onOpenSettingsPage={() => changePage('settings')}
        />
      )}
      <div className="flex flex-1 overflow-y-hidden">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onNavigate={handleGoHome}
            onOpenTrendingPage={() => changePage('trending')}
            onOpenFollowingPage={() => changePage('following')}
            onOpenLibraryPage={() => changePage('library')}
            activePage={appPage}
          />
        )}

        {isSidebarOpen && width < 768 && showSidebar && (
          <div 
            onClick={toggleSidebar} 
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSidebar()}
            role="button"
            tabIndex={0}
            aria-label="Close navigation menu"
            className="fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 md:hidden"
          />
        )}

        <main 
          ref={mainContentRef}
          key={pageKey}
          id="main-content" 
          className="flex-1 animate-fade-in h-full overflow-y-auto"
        >
          {renderContent()}
        </main>
      </div>
      {showChrome && (
          <BottomNavBar 
            onGoHome={handleGoHome} 
            onOpenTrendingPage={() => changePage('trending')} 
            onOpenFollowingPage={() => changePage('following')}
            onOpenLibraryPage={() => changePage('library')}
            onOpenCreateModal={() => setIsCreateModalOpen(true)} 
            activePage={appPage} 
          />
      )}

      {isSearchPageOpen && (
        <SearchPage
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setIsSearchPageOpen(false)}
          searchResults={videos}
          isLoading={isLoading}
          onSelectVideo={(video) => {
            addRecentSearch(searchQuery);
            handleSelectVideo(video);
          }}
          recentSearches={recentSearches}
          onClearRecentSearches={clearRecentSearches}
          onRecentSearchClick={(query) => setSearchQuery(query)}
        />
      )}

      <CreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <VoiceSearchModal isOpen={isVoiceSearchOpen} onClose={() => setIsVoiceSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
