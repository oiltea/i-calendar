/**
 * 类型定义
 */

export interface ICSEventParams {
  uid: string
  dtstamp: string
  dtstart: string
  dtend?: string
  summary: string
  description: string
}

export interface WeatherDaily {
  date: string
  min_temperature: string
  max_temperature: string
  day_condition: string
  night_condition: string
  air_quality: string
}

export interface WeatherData {
  daily_forecast: WeatherDaily[]
}

export interface FuelPriceItem {
  name: string
  price_desc: string
}

export interface FuelPriceData {
  items: FuelPriceItem[]
  updated: string
}

export interface GoldMetal {
  today_price: string
  unit: string
}

export interface GoldPriceData {
  metals: GoldMetal[]
}

export interface HistoryItem {
  title: string
  year: string
  description: string
  link: string
}

export interface HistoryData {
  items: HistoryItem[]
}
