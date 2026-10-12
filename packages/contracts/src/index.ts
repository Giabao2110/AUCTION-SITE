/** VND amounts are integer strings in HTTP/Socket payloads; never floating point. */
export type MoneyVnd = string;
export type AuctionStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export interface AuctionSnapshot {
  id: string;
  title: string;
  status: AuctionStatus;
  currentPriceVnd: MoneyVnd;
  minimumIncrementVnd: MoneyVnd;
  endsAt: string;
  serverTime: string;
  version: number;
}
export interface BidRequest { amountVnd: MoneyVnd; }
export interface BidAccepted { auction: AuctionSnapshot; bidId: string; }
export interface ApiError { error: { code: string; message: string; requestId: string; }; }
/** Public event excludes personal bidder details. Fetch REST snapshot on reconnect. */
export interface AuctionUpdated { auction: AuctionSnapshot; }
