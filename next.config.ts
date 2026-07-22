import type { NextConfig } from "next";

import { loadContent } from "./lib/content";

// Runs whenever the application is built or started, so a content mistake
// fails the build instead of reaching a Learner (#10). CONTENT_DIR is set only
// by the test suite, which points it at broken fixture content to prove this
// path actually refuses to build.
loadContent(process.env.CONTENT_DIR);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
