// Mapbox configuration
// Token should be provided via environment variable for production
// For development, it can be set here but should never be logged or exposed

const getMapboxToken = (): string => {
  // Try to get from environment variable first
  const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (envToken) {
    return envToken;
  }

  // Fallback token for development - in production, always use env variable
  // This is a public access token and is safe to include in client-side code
  // It should be restricted by domain in the Mapbox dashboard
  return "pk.eyJ1IjoiamVhbmFsdmFyZXplIiwiYSI6ImNtaXY3Z3ZxbjF3NzIzZXEyNHViaHhidHgifQ.Pd4zhq5CF-0oPS5mW-NN9Q";
};

export const MAPBOX_TOKEN = getMapboxToken();

// Validate token exists
if (!MAPBOX_TOKEN) {
  console.error("Mapbox access token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN environment variable.");
}
