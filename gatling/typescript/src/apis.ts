import {
  simulation,
  scenario,
  exec,
  csv,
  pause,
  css,
  feed,
  repeat,
  tryMax,
  rampUsers,
  ChainBuilder,
  substring,
  regex
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export const news: ChainBuilder = exec(
  http("news").get("https://whirlpool.net.au").check(status().is(200))
);

export const forum: ChainBuilder = exec(
  http("forums")
    .get("https://forums.whirlpool.net.au")
    .check(regex(`title"><a href="/forum/(.*?)"`).findRandom().saveAs("forumid"), status().is(200)),

  http("get_forum")
    .get("https://forums.whirlpool.net.au/forum/#{forumid}")
    .check(
      regex(`class="title" href="/thread/(.*?)"`).findRandom().saveAs("threadid"),
      status().is(200)
    ),
  http("get_thread")
    .get("https://forums.whirlpool.net.au/thread/#{threadid}")
    .check(status().is(200))
);

export const knowledge: ChainBuilder = exec(
  http("knowledge")
    .get("https://whirlpool.net.au/wiki")
    .check(status().is(200), substring("Gaming"))
);
const feeder = csv("search.csv").random();
export const search: ChainBuilder = exec(
  feed(feeder),
  http("search").get("https://forums.whirlpool.net.au/search?q=#{query}").check(status().is(200))
);
