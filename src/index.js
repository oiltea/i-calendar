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
import fuelPrice from "./fuel-price"
import goldPrice from "./gold-price"
import todayInHistory from "./today-in-history"

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/weather.ics") {
      return weather(request)
    }

    if (url.pathname === "/fuel-price.ics") {
      return fuelPrice(request)
    }

    if (url.pathname === "/gold-price.ics") {
      return goldPrice(request)
    }

    if (url.pathname === "/today-in-history.ics") {
      return todayInHistory(request)
    }

    return new Response("Not Found", { status: 404 })
  }
}
