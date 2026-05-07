export async function geocodeAddress(address: string) {
  const query = encodeURIComponent(address);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
  );

  const data = await response.json();

  if (!data.length) {
    return null;
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}