CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE,
  password_hash text NOT NULL, display_name text NOT NULL,
  role text NOT NULL DEFAULT 'MEMBER' CHECK(role IN ('MEMBER','ADMIN')),
  disabled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
  token_hash text NOT NULL UNIQUE, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, name text NOT NULL);
CREATE TABLE auctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), seller_id uuid NOT NULL REFERENCES users(id),
  category_id uuid NOT NULL REFERENCES categories(id), title varchar(160) NOT NULL,
  description text NOT NULL, image_url text,
  status text NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','SCHEDULED','ACTIVE','ENDED','CANCELLED')),
  opening_price_vnd bigint NOT NULL CHECK(opening_price_vnd > 0),
  current_price_vnd bigint NOT NULL CHECK(current_price_vnd >= opening_price_vnd),
  minimum_increment_vnd bigint NOT NULL CHECK(minimum_increment_vnd > 0),
  starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL CHECK(ends_at > starts_at),
  highest_bidder_id uuid REFERENCES users(id), version integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), auction_id uuid NOT NULL REFERENCES auctions(id),
  bidder_id uuid NOT NULL REFERENCES users(id), amount_vnd bigint NOT NULL CHECK(amount_vnd > 0),
  idempotency_key uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(bidder_id, idempotency_key)
);
CREATE TABLE auction_results (
  auction_id uuid PRIMARY KEY REFERENCES auctions(id), winner_id uuid REFERENCES users(id),
  winning_bid_id uuid REFERENCES bids(id), final_price_vnd bigint,
  closed_at timestamptz NOT NULL DEFAULT now(),
  CHECK((winner_id IS NULL AND winning_bid_id IS NULL AND final_price_vnd IS NULL)
     OR (winner_id IS NOT NULL AND winning_bid_id IS NOT NULL AND final_price_vnd > 0))
);
CREATE TABLE watchlists (user_id uuid REFERENCES users(id), auction_id uuid REFERENCES auctions(id), PRIMARY KEY(user_id,auction_id));
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES users(id),
  action text NOT NULL, entity_id uuid, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auctions_listing_idx ON auctions(status, ends_at);
CREATE INDEX auctions_seller_idx ON auctions(seller_id, created_at);
CREATE INDEX bids_history_idx ON bids(auction_id, created_at DESC, id);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);
