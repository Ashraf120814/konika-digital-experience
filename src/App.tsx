import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { FinderPage } from './pages/FinderPage';
import { PurchasePlansPage } from './pages/PurchasePlansPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { CampaignPage } from './pages/CampaignPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { ContentStudioPage } from './pages/admin/ContentStudioPage';
import { CalendarPage } from './pages/admin/CalendarPage';
import { SaruReportsPage } from './pages/admin/SaruReportsPage';
import { SaruKnowledgePage } from './pages/admin/SaruKnowledgePage';
import { SearchOverlay } from './components/SearchOverlay';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { SaruWidget } from './saru/components/SaruWidget';
import { startSaruScheduler } from './saru/services/scheduler';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    startSaruScheduler();
  }, []);

  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header onSearch={() => setSearchOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jewellery" element={<CollectionPage title="All Jewellery" />} />
              <Route path="/collections/:collection" element={<CollectionPage />} />
              <Route path="/bridal" element={<CollectionPage title="Bridal" filterCollection="Bridal" />} />
              <Route path="/bestsellers" element={<CollectionPage title="Bestsellers" bestsellers />} />
              <Route path="/new-arrivals" element={<CollectionPage title="New Arrivals" newest />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/jewellery-finder" element={<FinderPage />} />
              <Route path="/purchase-plans" element={<PurchasePlansPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/stories/:slug" element={<StoryDetailPage />} />
              <Route path="/campaigns/the-stories-we-wear" element={<CampaignPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/content" element={<ContentStudioPage />} />
              <Route path="/admin/calendar" element={<CalendarPage />} />
              <Route path="/admin/saru" element={<SaruReportsPage />} />
              <Route path="/admin/saru/knowledge" element={<SaruKnowledgePage />} />
              <Route path="/case-study" element={<CaseStudyPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
          <SaruWidget />
          <div className="fixed bottom-3 left-3 z-40 pointer-events-none">
            <span className="text-[9px] tracking-wider uppercase bg-charcoal/80 text-ivory/80 px-2 py-1 rounded">
              Konika Jewellery — Digital Experience Concept
            </span>
          </div>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
