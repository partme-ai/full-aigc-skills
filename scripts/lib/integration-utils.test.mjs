import test from "node:test";
import assert from "node:assert/strict";

import {
  buildVendoredSlug,
  globToRegExp,
  matchesAnyPattern,
} from "./integration-utils.mjs";

test("buildVendoredSlug prefixes integrated skills", () => {
  assert.equal(buildVendoredSlug("baoyu", "baoyu-post-to-wechat"), "integ-baoyu-baoyu-post-to-wechat");
  assert.equal(
    buildVendoredSlug("baoyu", "baoyu-post-to-wechat", {
      "baoyu-post-to-wechat": "integ-baoyu-wechat-publish",
    }),
    "integ-baoyu-wechat-publish",
  );
});

test("matchesAnyPattern supports globs", () => {
  const patterns = ["baoyu-post-to-*", "skills/baoyu-imagine"];
  assert.equal(matchesAnyPattern("baoyu-post-to-wechat", patterns), true);
  assert.equal(matchesAnyPattern("skills/baoyu-imagine", patterns), true);
  assert.equal(matchesAnyPattern("baoyu-translate", patterns), false);
  assert.equal(globToRegExp("a*b").test("acb"), true);
});
