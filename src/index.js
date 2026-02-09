/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import weather from "./weather"
import fuel from "./fuel"
import history from "./history"

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/weather.ics") {
      return weather(request)
    }

    if (url.pathname === "/fuel.ics") {
      return fuel(request)
    }

    if (url.pathname === "/history.ics") {
      return history(request)
    }

    return new Response("Not Found", { status: 404 })
  }
}
