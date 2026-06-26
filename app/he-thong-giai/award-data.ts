/**
 * Re-export shim — AwardDetail now lives in lib/data/types.ts.
 * award-content.tsx and award-detail-card.tsx import from here; this keeps
 * those paths valid without touching files outside this task's scope.
 */
export type { AwardDetail } from "@/lib/data/types";
