import http from "k6/http";
import { check } from "k6";

export class Api {
  __url;
  __headers;
  t_get_news;
  t_get_discussions;
  t_get_header;
  t_get_thread;
  t_get_knowledge;
  t_get_search;
  t_open_search_item;
  constructor(url, headers) {
    this.__url = url;
    this.__headers = headers;
  }

  /** /news */
  get_news() {
    const r = http.get(`${this.__url}whirlpool.net.au/`, this.__headers);
    check(r, { "GET whirlpool.net.au": (req) => req.status == 200 });
    this.t_get_news.add(r.timings.duration);
    return r;
  }

  /** forums.whirlpool.net.au/ */
  get_discussions() {
    const r = http.get(`${this.__url}forums.whirlpool.net.au/`, this.__headers);
    check(r, { "GET forums.whirlpool.net.au": (req) => req.status == 200 });
    this.t_get_discussions.add(r.timings.duration);
    return r;
  }

  /** forums.whirlpool.net.au/forum/${header} */
  get_header(header) {
    const r = http.get(`${this.__url}forums.whirlpool.net.au/forum/${header}`, this.__headers);
    check(r, { "GET forums.whirlpool.net.au/forum/${header}": (req) => req.status == 200 });
    this.t_get_header.add(r.timings.duration);
    return r;
  }

  /** forums.whirlpool.net.au/thread/${thread} */
  get_thread(thread) {
    const r = http.get(`${this.__url}forums.whirlpool.net.au/thread/${thread}`, this.__headers);
    check(r, { "forums.whirlpool.net.au/thread/{thread}": (req) => req.status == 200 });
    this.t_get_thread.add(r.timings.duration);
    return r;
  }

  /** whirlpool.net.au/wiki */
  get_knowledge() {
    const r = http.get(`${this.__url}whirlpool.net.au/wiki/`, this.__headers);
    check(r, { "whirlpool.net.au/wiki/": (req) => req.status == 200 });
    this.t_get_knowledge.add(r.timings.duration);
    return r;
  }

  /** forums.whirlpool.net.au/search */
  get_search(search) {
    const r = http.get(`${this.__url}forums.whirlpool.net.au/search?q=${search}`, this.__headers);
    check(r, { "forums.whirlpool.net.au/search": (req) => req.status == 200 });
    this.t_get_search.add(r.timings.duration);
    return r;
  }

  /** forums.whirlpool.net.au/archive/${searchid} */
  open_search_item(item) {
    const r = http.get(`${this.__url}forums.whirlpool.net.au/archive/${item}`, this.__headers);
    check(r, { "forums.whirlpool.net.au/archive/{item}": (req) => req.status == 200 });
    this.t_open_search_item.add(r.timings.duration);
    return r;
  }
}
