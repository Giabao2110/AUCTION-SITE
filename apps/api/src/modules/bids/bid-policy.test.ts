import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBid, extendedDeadline } from './bid-policy.js';
const base = { status: 'ACTIVE', sellerId: 'seller', bidderId: 'buyer', now: new Date('2026-10-12T00:00:00Z'), endsAt: new Date('2026-10-12T00:01:00Z'), currentPriceVnd: 100000n, openingPriceVnd: 100000n, minimumIncrementVnd: 10000n, hasBids: true, amountVnd: 110000n };
test('first bid can equal opening price; subsequent bid must respect increment', () => {
  assert.equal(validateBid({ ...base, hasBids: false, amountVnd: 100000n }), null);
  assert.equal(validateBid({ ...base, amountVnd: 109999n }), 'BID_TOO_LOW');
  assert.equal(validateBid(base), null);
});
test('seller cannot bid, and deadline is exclusive', () => {
  assert.equal(validateBid({ ...base, bidderId: 'seller' }), 'SELF_BIDDING');
  assert.equal(validateBid({ ...base, now: base.endsAt }), 'AUCTION_NOT_ACTIVE');
});
test('anti-sniping extends accepted late bid, but early bids do not extend', () => {
  assert.equal(extendedDeadline(base.now, base.endsAt), base.endsAt);
  assert.equal(extendedDeadline(new Date('2026-10-12T00:00:30Z'), base.endsAt).toISOString(), '2026-10-12T00:01:30.000Z');
});
