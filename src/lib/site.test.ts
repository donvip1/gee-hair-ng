import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, normalizeSiteUrl, siteUrl } from "./site";

test("normalizes configured site URLs", () => {
  assert.equal(normalizeSiteUrl("gee-hair.example/"), "https://gee-hair.example");
  assert.equal(normalizeSiteUrl("https://gee-hair.example///"), "https://gee-hair.example");
});

test("creates absolute URLs from application paths", () => {
  assert.equal(absoluteUrl("/services"), `${siteUrl}/services`);
  assert.equal(absoluteUrl("shop"), `${siteUrl}/shop`);
});
