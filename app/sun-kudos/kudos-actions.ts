"use server";

// Server Action wrappers for kudos hearts — consumed by KudosCard.
// Calls the data-layer mutations and revalidates the board.

import { likeKudo, unlikeKudo } from "@/lib/data/hearts-mutations";

export { likeKudo, unlikeKudo };
