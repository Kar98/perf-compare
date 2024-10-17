import http from "k6/http";
import { SharedArray } from "k6/data";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { test, scenario } from "k6/execution";
import { check, fail } from "k6";
import { Trend } from "k6/metrics";
import { Api } from "./apis.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Rate
const rampup = "30s";
const runtime = "30s";
const test_timeUnit = "1m";

const stage_news = [
  { target: 5, duration: rampup },
  { target: 5, duration: runtime }
];
const stage_forum = [
  { target: 10, duration: rampup },
  { target: 10, duration: runtime }
];
const stage_knowledge = [
  { target: 5, duration: rampup },
  { target: 5, duration: runtime }
];
const stage_search = [
  { target: 8, duration: rampup },
  { target: 8, duration: runtime }
];

const t_get_news = new Trend("t_get_news", true);
const t_get_discussions = new Trend("t_get_discussions", true);
const t_get_header = new Trend("t_get_header", true);
const t_get_thread = new Trend("t_get_thread", true);
const t_get_knowledge = new Trend("t_get_knowledge", true);
const t_get_search = new Trend("t_get_search", true);
const t_get_search_item = new Trend("t_get_search_item", true);

var api = new Api("", {}); // if only we had type annotations

const search = new SharedArray("search data", function () {
  const f = JSON.parse(open("./search.json"));
  return f.search;
});

function setup() {
  api = new Api("https://", undefined);
  api.t_get_news = t_get_news;
  api.t_get_discussions = t_get_discussions;
  api.t_get_header = t_get_header;
  api.t_get_thread = t_get_thread;
  api.t_get_knowledge = t_get_knowledge;
  api.t_get_search = t_get_search;
  api.t_open_search_item = t_get_search_item;
}

setup();

function get_random_item(regexp, data) {
  const matches = data.match(regexp);
  const num = randomIntBetween(0, matches.length);
  const match = matches[num];
  const splits = match.split("/");
  const header = splits[splits.length - 1];
  return header.substring(0, header.length - 1);
}

export function News() {
  api.get_news();
}

export function Forum() {
  const r = api.get_discussions();
  const header = get_random_item(/title"><a href="\/forum\/(.*?)"/g, r.body);
  const r2 = api.get_header(header);
  const thread = get_random_item(/href="\/thread\/(.*?)"/g, r2.body);
  const r3 = api.get_thread(thread);
  check(r3, r3.body.includes("userid"));
}

export function Knowledge() {
  const r = api.get_knowledge();
  check(r, { "knowledge check": (r) => r.body.includes("Gaming") });
}

export function Search() {
  const q = search[randomIntBetween(0, search.length)];
  const r = api.get_search(q);
  const matches = r.body.match(/title"><a href="\/archive\/(.*?)"/g);
  const num = Math.floor(matches.length / 2 - 1);
  const match = matches[num];
  const splits = match.split("/");
  const item = splits[splits.length - 1];
  const sub = item.substring(0, item.length - 1);
  const r2 = api.open_search_item(sub);
}

export const options = {
  scenarios: {
    // Test: {
    //   executor: "per-vu-iterations",
    //   vus: 1,
    //   iterations: 1,
    //   maxDuration: "1m",
    //   exec: "Search"
    // }
    News: {
      executor: "ramping-arrival-rate",
      stages: stage_news,
      preAllocatedVUs: 1,
      startRate: 1,
      timeUnit: "1m",
      maxVUs: 5,
      gracefulStop: "1s",
      exec: "News"
    },
    Forum: {
      executor: "ramping-arrival-rate",
      stages: stage_forum,
      preAllocatedVUs: 1,
      startRate: 1,
      timeUnit: test_timeUnit,
      maxVUs: 5,
      gracefulStop: "1s",
      exec: "Forum"
    },
    Knowledge: {
      executor: "ramping-arrival-rate",
      stages: stage_knowledge,
      preAllocatedVUs: 1,
      startRate: 1,
      timeUnit: test_timeUnit,
      maxVUs: 5,
      gracefulStop: "1s",
      exec: "Knowledge"
    },
    Search: {
      executor: "ramping-arrival-rate",
      stages: stage_search,
      preAllocatedVUs: 1,
      startRate: 1,
      timeUnit: test_timeUnit,
      maxVUs: 5,
      gracefulStop: "1s",
      exec: "Search"
    }
  },
  thresholds: {
    http_req_duration: ["p(90)<2000"]
  },
  maxRedirects: 3,
  summaryTrendStats: ["med", "p(90)", "p(95)", "p(99)", "count"]
};
