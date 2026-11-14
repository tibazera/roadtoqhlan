/** Team hometowns (shared by the players themselves) and the São Paulo meeting hub. */
export type Home = { nick: string; city: string; uf: string; lat: number; lon: number };

export const HOMES: Home[] = [
  { nick: "Tiba", city: "Londrina", uf: "PR", lat: -23.3045, lon: -51.1696 },
  { nick: "Mur", city: "Fortaleza", uf: "CE", lat: -3.7319, lon: -38.5267 },
  { nick: "GT", city: "Rio Grande", uf: "RS", lat: -32.035, lon: -52.0986 },
];

/** IBGE state code -> UF abbreviation. */
export const UF_BY_CODE: Record<string, string> = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA",
  "31": "MG", "32": "ES", "33": "RJ", "35": "SP", "41": "PR", "42": "SC", "43": "RS",
  "50": "MS", "51": "MT", "52": "GO", "53": "DF",
};

/** [lon, lat, name, size] — painted on the globe texture. */
export const COUNTRY_LABELS: [number, number, string, number][] = [
  [-53, -10, "BRAZIL", 1.5], [-65, -36, "ARGENTINA", 1], [-64, -17, "BOLIVIA", 0.8], [-75, -9, "PERU", 0.8],
  [-73, 3.5, "COLOMBIA", 0.8], [-66, 7, "VENEZUELA", 0.8], [-58.5, -23.3, "PARAGUAY", 0.6], [-56, -32.8, "URUGUAY", 0.5],
  [-100, 40, "UNITED STATES", 1], [-100, 58, "CANADA", 1], [-102, 24, "MEXICO", 0.8], [-42, 72, "GREENLAND", 0.8],
  [-6, 32, "MOROCCO", 0.6], [3, 28, "ALGERIA", 0.9], [-4, 17, "MALI", 0.8], [8, 9.5, "NIGERIA", 0.7], [30, 27, "EGYPT", 0.8],
  [-8, 39.6, "PORTUGAL", 0.5], [-3.7, 40.2, "SPAIN", 0.8], [2.5, 46.6, "FRANCE", 0.8], [-2.5, 54, "UNITED KINGDOM", 0.55],
  [-8, 53.2, "IRELAND", 0.45], [10.3, 51.3, "GERMANY", 0.7], [12.6, 42.6, "ITALY", 0.7], [19.4, 52, "POLAND", 0.65],
  [8.6, 61.4, "NORWAY", 0.55], [15.6, 62.2, "SWEDEN", 0.6], [27, 63.6, "FINLAND", 0.55], [9.5, 56, "DENMARK", 0.4],
  [31, 49, "UKRAINE", 0.7], [60, 60, "RUSSIA", 1.2],
  [-18.5, 65, "ICELAND", 0.5], [5.5, 52.4, "NETHERLANDS", 0.32], [4.6, 50.6, "BELGIUM", 0.28], [8.2, 46.8, "SWITZERLAND", 0.28],
  [14.5, 47.6, "AUSTRIA", 0.32], [15.5, 49.8, "CZECHIA", 0.32], [25, 45.8, "ROMANIA", 0.45], [19.5, 47.2, "HUNGARY", 0.32],
  [22, 39.3, "GREECE", 0.42], [35, 39, "TURKEY", 0.7], [28, 53.5, "BELARUS", 0.5], [23.9, 55.3, "LITHUANIA", 0.22],
  [24.8, 56.9, "LATVIA", 0.22], [25.6, 58.9, "ESTONIA", 0.22], [25.2, 42.8, "BULGARIA", 0.36], [20.8, 44, "SERBIA", 0.3],

];
