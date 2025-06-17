
export const DEGREE_SYNONYMS: Record<string, string> = {
    "hnd": "Higher National Diploma",
    "higher national diploma": "Higher National Diploma",
    "nd": "National Diploma",
    "national diploma": "National Diploma",
    "bsc": "Bachelor",
    "msc": "Masters",
    "phd": "PhD",
    "ssce": "High School"
  };
  
  export function normalizeDegreeSearch(input: string): string {
    const lower = input.toLowerCase().trim();
    return DEGREE_SYNONYMS[lower] || input;
  }
  