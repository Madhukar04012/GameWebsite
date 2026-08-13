// Simple deterministic LCG (Linear Congruential Generator)
export class PRNG {
  private seed: number;

  constructor(seed: number | string) {
    if (typeof seed === "string") {
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Returns float between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

const FIRST_NAMES = [
  "Alden", "Beric", "Cael", "Doran", "Elian", "Fend", "Garrick", "Haldor", "Ilias", "Jory",
  "Kael", "Lorik", "Merek", "Nyles", "Orin", "Perrin", "Quinn", "Rowan", "Soren", "Torin",
  "Uric", "Vance", "Willem", "Xander", "Yoren", "Zane",
  "Alys", "Bess", "Catelyn", "Dara", "Elara", "Frey", "Gemma", "Hera", "Isolde", "Jeyne",
  "Kira", "Lyra", "Mira", "Nia", "Olenna", "Piper", "Qyburn", "Rhea", "Sansa", "Talia",
  "Una", "Vera", "Willa", "Xenia", "Yara", "Zara"
];

const FAMILY_NAMES = [
  "Ashwood", "Blackwood", "Cassel", "Dawn", "Evergreen", "Frost", "Glover", "Hightower",
  "Irons", "Just", "Karstark", "Lann", "Mormont", "North", "Oakheart", "Payne", "Quill",
  "Reed", "Stark", "Tully", "Umber", "Vane", "Webber", "Xo", "Yronwood", "Zant"
];

export function generateDeterministicName(seedStr: string): string {
  const prng = new PRNG(seedStr);
  const first = prng.pick(FIRST_NAMES);
  const family = prng.pick(FAMILY_NAMES);
  return `${first} ${family}`;
}
