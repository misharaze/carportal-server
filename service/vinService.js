

export async function checkVin(vin) {
  const res = await fetch(`https://api.vin-decoder.eu/api/v1/decode/${vin}`);
  return await res.json();
}
