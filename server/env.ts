/** Bindings and variables available to every Function (see wrangler.toml). */
export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  /** Static assets of the Pages project (dist/). */
  ASSETS: Fetcher;
  /** Service binding to the mstradingco-mailer Worker, once switched on. */
  MAILER?: Fetcher;

  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET?: string;
  SITE_URL: string;
  MAIL_FROM: string;
  /** Local development only (.dev.vars); honoured only on localhost. */
  DEV_BYPASS_ACCESS?: string;
}

export type Fn<Params extends string = never> = PagesFunction<Env, Params>;
