// F011 — Secret Box reward engine.
// Pure function: no side effects, no Math.random (caller passes roll).
// Deterministic band mapping so boundary tests are exact.

export interface BadgeReward {
  id: string;
  name: string;
  image: string;
}

// Weights (cumulative) — must sum to 1.0.
// Order: Stay Gold 0.30 · Flow to Horizon 0.25 · Touch of Light 0.20 ·
//        Beyond the Boundary 0.10 · Revival 0.10 · Root Further 0.05
export const BADGE_TABLE: ReadonlyArray<{
  cumulative: number;
  reward: BadgeReward;
}> = [
  {
    cumulative: 0.30,
    reward: {
      id: "stay-gold",
      name: "Stay Gold",
      image: "/saa-2025/badge-stay-gold.png",
    },
  },
  {
    cumulative: 0.55, // 0.30 + 0.25
    reward: {
      id: "flow-to-horizon",
      name: "Flow to Horizon",
      image: "/saa-2025/badge-flow-to-horizon.png",
    },
  },
  {
    cumulative: 0.75, // 0.55 + 0.20
    reward: {
      id: "touch-of-light",
      name: "Touch of Light",
      image: "/saa-2025/badge-touch-of-light.png",
    },
  },
  {
    cumulative: 0.85, // 0.75 + 0.10
    reward: {
      id: "beyond-the-boundary",
      name: "Beyond the Boundary",
      image: "/saa-2025/badge-beyond-the-boundary.png",
    },
  },
  {
    cumulative: 0.95, // 0.85 + 0.10
    reward: {
      id: "revival",
      name: "Revival",
      image: "/saa-2025/badge-revival.png",
    },
  },
  {
    cumulative: 1.0, // 0.95 + 0.05
    reward: {
      id: "root-further",
      name: "Root Further",
      image: "/saa-2025/badge-root-further.png",
    },
  },
] as const;

/**
 * Map a roll ∈ [0, 1) to a BadgeReward.
 * Roll is clamped to [0, 1) — caller is responsible but this is defensive.
 * roll < 0.30  → Stay Gold
 * roll < 0.55  → Flow to Horizon
 * roll < 0.75  → Touch of Light
 * roll < 0.85  → Beyond the Boundary
 * roll < 0.95  → Revival
 * else         → Root Further
 */
export function drawBadge(roll: number): BadgeReward {
  // Clamp finite out-of-range rolls into [0, 1). NaN is NOT clamped (Math.min/max
  // propagate NaN); it fails every `<` comparison below and is caught by the
  // final fallback, which returns the last band (Root Further) — still a valid reward.
  const safeRoll = Math.min(Math.max(roll, 0), 0.9999999);

  for (const entry of BADGE_TABLE) {
    if (safeRoll < entry.cumulative) {
      return entry.reward;
    }
  }

  // Fallback: reached only for NaN (all comparisons false). Table sums to 1.0,
  // so any finite clamped roll matches a band above.
  return BADGE_TABLE[BADGE_TABLE.length - 1].reward;
}
