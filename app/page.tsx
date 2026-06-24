// The root route (/) IS the home page — it renders the same auth-gated home
// screen as /home, from a single source (app/home/page.tsx). Both URLs show
// the same page; unauthenticated visitors are redirected to /login by the
// shared auth guard.
export { metadata } from "./home/page";
export { default } from "./home/page";
