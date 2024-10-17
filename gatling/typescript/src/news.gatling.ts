import {
  simulation,
  scenario,
  pause,
  atOnceUsers,
  AllowList,
  DenyList,
  RawFileBody
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { news } from "./apis";

const httpProtocol = http
  .inferHtmlResources()
  .acceptHeader("image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5")
  .acceptEncodingHeader("gzip, deflate, br")
  .acceptLanguageHeader("en-US,en;q=0.5")
  .doNotTrackHeader("1")
  .userAgentHeader(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
  );

const scn = scenario("forum").exec(news);

export default simulation((setUp) => {
  setUp(scn.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});
