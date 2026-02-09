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

type RouteHandler = (request: Request) => Promise<Response>

const routes: Record<string, RouteHandler> = {
  "/weather.ics": weather,
  "/fuel-price.ics": fuelPrice,
  "/gold-price.ics": goldPrice,
  "/today-in-history.ics": todayInHistory,
}

const homePage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i-calendar - 日历订阅服务</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    h1 { color: #333; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .endpoint { margin: 20px 0; }
  </style>
</head>
<body>
  <h1>📅 i-calendar 日历订阅服务</h1>
  <p>提供多种实用的日历订阅地址，可导入到日历应用中。</p>
  
  <div class="endpoint">
    <h2>🌤 天气预报</h2>
    <pre>https://i-calendar.oiltea94.workers.dev/weather.ics?query=成都&days=8</pre>
    <p>参数：<code>query</code> 城市名称，<code>days</code> 预报天数（最多8天）</p>
  </div>

  <div class="endpoint">
    <h2>⛽ 燃油价格</h2>
    <pre>https://i-calendar.oiltea94.workers.dev/fuel-price.ics?region=成都&primary=92</pre>
    <p>参数：<code>region</code> 地区名称，<code>primary</code> 主要油品（可选）</p>
  </div>

  <div class="endpoint">
    <h2>💰 今日金价</h2>
    <pre>https://i-calendar.oiltea94.workers.dev/gold-price.ics</pre>
  </div>

  <div class="endpoint">
    <h2>📜 历史上的今天</h2>
    <pre>https://i-calendar.oiltea94.workers.dev/today-in-history.ics</pre>
  </div>
</body>
</html>
`

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(homePage, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      })
    }

    const handler = routes[url.pathname]

    if (handler) {
      try {
        return await handler(request)
      } catch (error) {
        console.error(`Error handling ${url.pathname}:`, error)
        return new Response("Internal Server Error", { status: 500 })
      }
    }

    return new Response("Not Found", { status: 404 })
  }
}
