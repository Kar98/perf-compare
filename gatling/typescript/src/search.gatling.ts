import { simulation, scenario, pause, atOnceUsers, AllowList, DenyList, RawFileBody } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

  const httpProtocol = http
    .baseUrl("https://forums.whirlpool.net.au")
    .inferHtmlResources()
    .acceptHeader("image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5")
    .acceptEncodingHeader("gzip, deflate, br")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0");
  
  const headers_0 = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
    "Priority": "u=0, i",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
  };
  
  const headers_1 = {
    "Accept": "*/*",
    "Alt-Used": "whirlpool.net.au",
    "Sec-Fetch-Dest": "script",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-site"
  };
  
  const headers_2 = {
    "Alt-Used": "whirlpool.net.au",
    "Sec-Fetch-Dest": "image",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-site"
  };
  
  const uri2 = "https://whirlpool.net.au/skin";

  const scn = scenario("search")
    .exec(
      http("request_0")
        .get("/search?q=gaming")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get(uri2 + "/script.js?2e1c62ef0449")
            .headers(headers_1),
          http("request_2")
            .get(uri2 + "/image/whirlpool-2015-icon-180.png")
            .headers(headers_2),
          http("request_3")
            .get(uri2 + "/image/whirlpool-2015-favicon.png")
            .headers(headers_2)
        )
    );

export default simulation((setUp) => {
  setUp(scn.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});
