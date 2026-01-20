const getMapboxToken = (): string => {

  const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (envToken) {
    return envToken;
  }
};

export const MAPBOX_TOKEN = getMapboxToken();

// Validate token exists
if (!MAPBOX_TOKEN) {
  console.error("Mapbox access token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN environment variable.");
}
