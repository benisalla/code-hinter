import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import RequireAuth from 'src/components/RequireAuth';

// ----------------------------------------------------------------------

export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ExercisesPage = lazy(() => import('src/pages/exercise'));
export const StudentsPage = lazy(() => import('src/pages/students'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const NewExercisePage = lazy(() => import('src/pages/edit-exercise'));
export const SolveExercisePage = lazy(() => import('src/pages/home'));
export const SubmitionsPage = lazy(() => import('src/pages/submisions'));
// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <RequireAuth>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </RequireAuth>
        </DashboardLayout >
      ),
      children: [
        { element: <ExercisesPage />, index: true },
        { path: 'students', element: <StudentsPage /> },
        // { path: 'user', element: <UserPage /> },
        { path: 'exercises', element: <ExercisesPage /> },
        { path: 'solve-exercise/:Id', element: <SolveExercisePage /> },
        { path: 'new-exercise/:Id', element: <NewExercisePage /> },
        { path: 'new-exercise', element: <NewExercisePage /> },
        { path: 'submitions/:Id', element: <SubmitionsPage />}
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
