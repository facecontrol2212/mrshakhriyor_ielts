import { createBrowserRouter } from 'react-router'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Heavier pages load on demand so the landing page stays small.
export const router = createBrowserRouter(
  [
    {
      element: <SiteLayout />,
      hydrateFallbackElement: <div className="min-h-screen" />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/tests', lazy: () => import('./pages/TestsPage').then((m) => ({ Component: m.TestsPage })) },
        { path: '/tests/:testId', lazy: () => import('./pages/TestDetailPage').then((m) => ({ Component: m.TestDetailPage })) },
        { path: '/results/:attemptId', lazy: () => import('./pages/ResultsPage').then((m) => ({ Component: m.ResultsPage })) },
        { path: '/dashboard', lazy: () => import('./pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })) },
        { path: '/band-calculator', lazy: () => import('./pages/BandCalculatorPage').then((m) => ({ Component: m.BandCalculatorPage })) },
        { path: '/articles', lazy: () => import('./pages/ArticlesPage').then((m) => ({ Component: m.ArticlesPage })) },
        { path: '/articles/:slug', lazy: () => import('./pages/ArticlePage').then((m) => ({ Component: m.ArticlePage })) },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    // The exam and answer review take over the whole screen, like the real test.
    { path: '/exam/:attemptId', lazy: () => import('./pages/ExamPage').then((m) => ({ Component: m.ExamPage })) },
    { path: '/review/:attemptId/:skill', lazy: () => import('./pages/ReviewPage').then((m) => ({ Component: m.ReviewPage })) },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
