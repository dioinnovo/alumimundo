/**
 * Progress Tracker for Web Scraping
 *
 * Logs scraping progress to database for tracking across sessions
 */

import { PrismaClient, ScrapeStatus } from '@prisma/client'

const prisma = new PrismaClient()

export class ProgressTracker {
  private scrapeLogId: string | null = null
  private providerId: string
  private startTime: number

  constructor(providerId: string) {
    this.providerId = providerId
    this.startTime = Date.now()
  }

  /**
   * Start a new scrape job
   */
  async start(scrapedBy: string = 'system'): Promise<string> {
    const scrapeLog = await prisma.scrapeLog.create({
      data: {
        providerId: this.providerId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        scrapedBy,
      },
    })

    this.scrapeLogId = scrapeLog.id
    this.startTime = Date.now()

    console.log(`\n🚀 Started scrape job: ${this.scrapeLogId}`)

    return this.scrapeLogId
  }

  /**
   * Update progress
   */
  async updateProgress(data: {
    productsFound?: number
    productsAdded?: number
    productsUpdated?: number
    imagesDownloaded?: number
  }): Promise<void> {
    if (!this.scrapeLogId) {
      throw new Error('Scrape job not started. Call start() first.')
    }

    await prisma.scrapeLog.update({
      where: { id: this.scrapeLogId },
      data,
    })
  }

  /**
   * Add an error to the log
   */
  async logError(error: string): Promise<void> {
    if (!this.scrapeLogId) {
      throw new Error('Scrape job not started. Call start() first.')
    }

    const currentLog = await prisma.scrapeLog.findUnique({
      where: { id: this.scrapeLogId },
    })

    const errors = currentLog?.errors ? JSON.parse(currentLog.errors) : []
    errors.push({
      timestamp: new Date().toISOString(),
      error,
    })

    await prisma.scrapeLog.update({
      where: { id: this.scrapeLogId },
      data: {
        errors: JSON.stringify(errors),
        errorMessage: error, // Store last error as quick reference
      },
    })

    console.error(`❌ Error logged: ${error}`)
  }

  /**
   * Complete the scrape job
   */
  async complete(data: {
    productsFound: number
    productsAdded: number
    productsUpdated: number
    imagesDownloaded: number
    status?: ScrapeStatus
    notes?: string
  }): Promise<void> {
    if (!this.scrapeLogId) {
      throw new Error('Scrape job not started. Call start() first.')
    }

    const duration = Math.floor((Date.now() - this.startTime) / 1000) // seconds

    await prisma.scrapeLog.update({
      where: { id: this.scrapeLogId },
      data: {
        status: data.status || 'COMPLETED',
        productsFound: data.productsFound,
        productsAdded: data.productsAdded,
        productsUpdated: data.productsUpdated,
        imagesDownloaded: data.imagesDownloaded,
        completedAt: new Date(),
        duration,
        notes: data.notes,
      },
    })

    console.log(`\n✅ Scrape job completed: ${this.scrapeLogId}`)
    console.log(`   Duration: ${this.formatDuration(duration)}`)
    console.log(`   Products Found: ${data.productsFound}`)
    console.log(`   Products Added: ${data.productsAdded}`)
    console.log(`   Products Updated: ${data.productsUpdated}`)
    console.log(`   Images Downloaded: ${data.imagesDownloaded}`)
  }

  /**
   * Fail the scrape job
   */
  async fail(errorMessage: string): Promise<void> {
    if (!this.scrapeLogId) {
      throw new Error('Scrape job not started. Call start() first.')
    }

    const duration = Math.floor((Date.now() - this.startTime) / 1000)

    await prisma.scrapeLog.update({
      where: { id: this.scrapeLogId },
      data: {
        status: 'FAILED',
        errorMessage,
        completedAt: new Date(),
        duration,
      },
    })

    console.error(`\n❌ Scrape job failed: ${this.scrapeLogId}`)
    console.error(`   Error: ${errorMessage}`)
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  /**
   * Get recent scrape logs for a provider
   */
  static async getRecentLogs(providerId: string, limit: number = 10) {
    return prisma.scrapeLog.findMany({
      where: { providerId },
      orderBy: { startedAt: 'desc' },
      take: limit,
      include: {
        provider: true,
      },
    })
  }

  /**
   * Get scrape statistics for a provider
   */
  static async getStats(providerId: string) {
    const logs = await prisma.scrapeLog.findMany({
      where: { providerId },
    })

    const totalJobs = logs.length
    const completedJobs = logs.filter(l => l.status === 'COMPLETED').length
    const failedJobs = logs.filter(l => l.status === 'FAILED').length
    const totalProducts = logs.reduce((sum, l) => sum + l.productsAdded, 0)
    const totalImages = logs.reduce((sum, l) => sum + l.imagesDownloaded, 0)

    const avgDuration = logs.reduce((sum, l) => sum + (l.duration || 0), 0) / totalJobs

    return {
      totalJobs,
      completedJobs,
      failedJobs,
      totalProducts,
      totalImages,
      avgDuration,
      successRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
    }
  }

  /**
   * Print progress summary
   */
  async printSummary(): Promise<void> {
    if (!this.scrapeLogId) {
      console.log('No active scrape job')
      return
    }

    const log = await prisma.scrapeLog.findUnique({
      where: { id: this.scrapeLogId },
      include: { provider: true },
    })

    if (!log) return

    console.log(`\n📊 Scrape Job Summary`)
    console.log(`   Provider: ${log.provider.name}`)
    console.log(`   Status: ${log.status}`)
    console.log(`   Started: ${log.startedAt.toLocaleString()}`)
    console.log(`   Duration: ${this.formatDuration(log.duration || 0)}`)
    console.log(`   Products Found: ${log.productsFound}`)
    console.log(`   Products Added: ${log.productsAdded}`)
    console.log(`   Products Updated: ${log.productsUpdated}`)
    console.log(`   Images Downloaded: ${log.imagesDownloaded}`)

    if (log.errors) {
      const errors = JSON.parse(log.errors)
      console.log(`   Errors: ${errors.length}`)
    }
  }
}
