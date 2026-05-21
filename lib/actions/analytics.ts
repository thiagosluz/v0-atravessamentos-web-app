"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { ensureAdmin } from "@/lib/utils/auth-guard"

export async function getAnalyticsData(period: "7" | "15" | "30" | "all" = "7") {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()

    let query = supabase
      .from("analytics_events")
      .select("event_type, created_at, asset_id")
      .order("created_at", { ascending: true })

    if (period !== "all") {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(period))
      query = query.gte("created_at", daysAgo.toISOString())
    }

    const { data: recentEvents, error } = await query

    if (error) throw error

    // Transform data for Recharts (Likes per day)
    const dailyData: Record<string, { date: string, likes: number }> = {}
    let totalRecentLikes = 0
    const assetCounts: Record<string, number> = {}

    // Initialize empty days if not 'all'
    if (period !== "all") {
      const days = parseInt(period)
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
        dailyData[dateStr] = { date: formattedDate, likes: 0 }
      }
    }

    if (recentEvents) {
      recentEvents.forEach(event => {
        const dateStr = event.created_at.split('T')[0]
        
        // For "all", initialize dynamically if not present
        if (period === "all" && !dailyData[dateStr]) {
          const d = new Date(event.created_at)
          const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
          dailyData[dateStr] = { date: formattedDate, likes: 0 }
        }

        if (event.event_type === 'like') {
          assetCounts[event.asset_id] = (assetCounts[event.asset_id] || 0) + 1
          if (dailyData[dateStr]) {
            dailyData[dateStr].likes += 1
            totalRecentLikes++
          }
        } else if (event.event_type === 'unlike') {
          assetCounts[event.asset_id] = Math.max(0, (assetCounts[event.asset_id] || 0) - 1)
          if (dailyData[dateStr]) {
            dailyData[dateStr].likes = Math.max(0, dailyData[dateStr].likes - 1)
            totalRecentLikes--
          }
        }
      })
    }

    let topAssetId = null
    let maxCount = -1
    for (const [id, count] of Object.entries(assetCounts)) {
      if (count > maxCount && count > 0) {
        maxCount = count
        topAssetId = id
      }
    }

    let trendingName = "Nenhum dado"
    if (topAssetId) {
      // Tenta buscar no acervo
      const { data: assetData } = await supabase.from("gallery_assets").select("title").eq("id", topAssetId).single()
      if (assetData) {
        trendingName = assetData.title
      } else {
        trendingName = "Obra Excluída"
      }
    }

    return { 
      success: true, 
      chartData: Object.values(dailyData),
      totalRecentLikes: Math.max(0, totalRecentLikes),
      trendingName
    }
  } catch (error: any) {
    console.error("Analytics Error:", error)
    return { success: false, error: error.message }
  }
}
