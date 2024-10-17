import {
  simulation,
  scenario,
  atOnceUsers,
  rampUsers,
  TimeUnit,
  rampConcurrentUsers,
  constantConcurrentUsers,
  Duration,
  reachRps,
  jumpToRps
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { forum, news, search, knowledge } from "./apis";

const httpProtocol = http
  .inferHtmlResources()
  .acceptHeader("image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5")
  .acceptEncodingHeader("gzip, deflate, br")
  .acceptLanguageHeader("en-US,en;q=0.5")
  .userAgentHeader(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
  );

const rampup: Duration = {
  amount: 1,
  unit: "minutes"
};
const runtime: Duration = { amount: 5, unit: "minutes" };

export default simulation((setUp) => {
  const searchSc = scenario("search").exec(search);
  const forumSc = scenario("forum").exec(forum);
  const newsSc = scenario("news").exec(news);
  const knowledgeSc = scenario("knowledge").exec(knowledge);

  setUp(
    searchSc
      .injectClosed(
        rampConcurrentUsers(0).to(3).during(rampup),
        constantConcurrentUsers(3).during(runtime)
      )
      .throttle(jumpToRps(1))
  ).protocols(httpProtocol);
  // setUp(forumSc.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
  // setUp(newsSc.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
  // setUp(knowledgeSc.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});

// npx gatling run --simulation main
