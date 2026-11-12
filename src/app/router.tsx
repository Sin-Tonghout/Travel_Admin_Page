import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth, RequirePermission } from "@/app/guards";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { NotFoundPage } from "@/components/shared/NotFoundPage";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { allNavItems } from "@/lib/navigation";
import type { AppModule } from "@/lib/permissions";

/** Loads a page on demand and wraps it in the permission check for its module. */
const lazyRoute = (module: AppModule, load: () => Promise<ComponentType>) => async () => {
  const Page = await load();
  return {
    Component: () => (
      <RequirePermission module={module}>
        <Page />
      </RequirePermission>
    ),
  };
};

// Modules that have real pages. The rest still show placeholders.
const builtModules = ["dashboard", "bookings", "tours", "destinations"];

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/admin/dashboard" replace /> },
  {
    path: "/login",
    lazy: async () => {
      const { LoginPage } = await import("@/features/auth/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        lazy: lazyRoute(
          "dashboard",
          async () => (await import("@/features/dashboard/DashboardPage")).DashboardPage,
        ),
      },
      {
        path: "bookings",
        lazy: lazyRoute(
          "bookings",
          async () => (await import("@/features/bookings/BookingsPage")).BookingsPage,
        ),
      },
      {
        path: "bookings/new",
        lazy: lazyRoute(
          "bookings",
          async () => (await import("@/features/bookings/NewBookingPage")).NewBookingPage,
        ),
      },
      {
        path: "bookings/:id",
        lazy: lazyRoute(
          "bookings",
          async () =>
            (await import("@/features/bookings/BookingDetailPage")).BookingDetailPage,
        ),
      },
      {
        path: "bookings/:id/edit",
        lazy: lazyRoute(
          "bookings",
          async () =>
            (await import("@/features/bookings/EditBookingPage")).EditBookingPage,
        ),
      },
      {
        path: "tours",
        lazy: lazyRoute(
          "tours",
          async () => (await import("@/features/tours/ToursPage")).ToursPage,
        ),
      },
      {
        path: "tours/new",
        lazy: lazyRoute(
          "tours",
          async () => (await import("@/features/tours/NewTourPage")).NewTourPage,
        ),
      },
      {
        path: "tours/:id",
        lazy: lazyRoute(
          "tours",
          async () => (await import("@/features/tours/TourDetailPage")).TourDetailPage,
        ),
      },
      {
        path: "tours/:id/edit",
        lazy: lazyRoute(
          "tours",
          async () => (await import("@/features/tours/EditTourPage")).EditTourPage,
        ),
      },
      {
        path: "destinations",
        lazy: lazyRoute(
          "destinations",
          async () =>
            (await import("@/features/destinations/DestinationsPage")).DestinationsPage,
        ),
      },
      {
        path: "destinations/new",
        lazy: lazyRoute(
          "destinations",
          async () =>
            (await import("@/features/destinations/NewDestinationPage")).default,
        ),
      },
      {
        path: "destinations/:id",
        lazy: lazyRoute(
          "destinations",
          async () =>
            (await import("@/features/destinations/DestinationDetailPage")).default,
        ),
      },
      {
        path: "destinations/:id/edit",
        lazy: lazyRoute(
          "destinations",
          async () => (await import("@/features/destinations/EditDestinationPage")).default,
        ),
      },
      ...allNavItems
        .filter((item) => !builtModules.includes(item.module))
        .map((item) => ({
          path: item.path.replace("/admin/", ""),
          element: (
            <RequirePermission module={item.module}>
              <PlaceholderPage title={item.label} phase={item.phase} />
            </RequirePermission>
          ),
        })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin/design-system",
    lazy: async () => {
      const { DesignSystemPage } =
        await import("@/features/design-system/DesignSystemPage");
      return {
        Component: () => (
          <RequireAuth>
            <DesignSystemPage />
          </RequireAuth>
        ),
      };
    },
  },
  { path: "*", element: <NotFoundPage /> },
]);
