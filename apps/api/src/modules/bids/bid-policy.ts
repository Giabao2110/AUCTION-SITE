export interface BidPolicyInput {
  status: string; sellerId: string; bidderId: string; now: Date; endsAt: Date;
  currentPriceVnd: bigint; openingPriceVnd: bigint; minimumIncrementVnd: bigint;
  hasBids: boolean; amountVnd: bigint;
}
/** Pure policy; DB service must call this AFTER locking the auction row. */
export function validateBid(input: BidPolicyInput): string | null {
  if (input.status !== 'ACTIVE' || input.now >= input.endsAt) return 'AUCTION_NOT_ACTIVE';
  if (input.sellerId === input.bidderId) return 'SELF_BIDDING';
  const minimum = input.hasBids ? input.currentPriceVnd + input.minimumIncrementVnd : input.openingPriceVnd;
  if (input.amountVnd < minimum) return 'BID_TOO_LOW';
  return null;
}
export function extendedDeadline(now: Date, endsAt: Date): Date {
  // Accepted bids in the last 30 seconds ensure at least 60 seconds remain.
  return endsAt.getTime() - now.getTime() <= 30000
    ? new Date(Math.max(endsAt.getTime(), now.getTime() + 60000)) : endsAt;
}
