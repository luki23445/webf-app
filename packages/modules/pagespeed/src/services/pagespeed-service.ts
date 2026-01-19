import { Errors, eventBus, encrypt, decrypt } from '@webf/core';
import type { AuthContext } from '@webf/core';

export class PageSpeedService {
  constructor(private getDb: () => any) {}

  async getApiKey(organizationId: string): Promise<string | null> {
    const config = await this.getDb().integrationConfig.findUnique({
      where: { organizationId_type: { organizationId, type: 'pagespeed' } },
    });

    if (!config) {
      return null;
    }

    const configData = config.configJson as any;
    const apiKey = configData.apiKey;
    if (config.encryptedFields.includes('apiKey')) {
      return decrypt(apiKey);
    }
    return apiKey;
  }

  async fetchPageSpeed(url: string, strategy: 'mobile' | 'desktop', apiKey: string) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`PageSpeed API error: ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const metrics = lighthouse.audits;

    return {
      scorePerformance: Math.round(lighthouse.categories.performance.score * 100),
      lcp: metrics['largest-contentful-paint']?.numericValue,
      cls: metrics['cumulative-layout-shift']?.numericValue,
      inp: metrics['interactive']?.numericValue,
      ttfb: metrics['server-response-time']?.numericValue,
      rawJson: data,
    };
  }

  async createSnapshot(context: AuthContext, targetId: string) {
    const target = await this.getDb().pageSpeedTarget.findUnique({
      where: { id: targetId },
    });

    if (!target) {
      throw Errors.notFound('PageSpeed target not found');
    }

    const apiKey = await this.getApiKey(context.organizationId);
    if (!apiKey) {
      throw Errors.validation('PageSpeed API key not configured');
    }

    // Fetch for both strategies
    const [mobile, desktop] = await Promise.all([
      this.fetchPageSpeed(target.url, 'mobile', apiKey).catch(() => null),
      this.fetchPageSpeed(target.url, 'desktop', apiKey).catch(() => null),
    ]);

    const snapshots = [];

    if (mobile) {
      const snapshot = await this.getDb().pageSpeedSnapshot.create({
        data: {
          targetId,
          strategy: 'mobile',
          scorePerformance: mobile.scorePerformance,
          lcp: mobile.lcp,
          cls: mobile.cls,
          inp: mobile.inp,
          ttfb: mobile.ttfb,
          rawJson: mobile.rawJson,
        },
      });
      snapshots.push(snapshot);

      await eventBus.publish({
        type: 'pagespeed.snapshot.created',
        data: { snapshotId: snapshot.id, targetId, strategy: 'mobile' },
        timestamp: new Date(),
        userId: context.userId,
        organizationId: context.organizationId,
      });
    }

    if (desktop) {
      const snapshot = await this.getDb().pageSpeedSnapshot.create({
        data: {
          targetId,
          strategy: 'desktop',
          scorePerformance: desktop.scorePerformance,
          lcp: desktop.lcp,
          cls: desktop.cls,
          inp: desktop.inp,
          ttfb: desktop.ttfb,
          rawJson: desktop.rawJson,
        },
      });
      snapshots.push(snapshot);

      await eventBus.publish({
        type: 'pagespeed.snapshot.created',
        data: { snapshotId: snapshot.id, targetId, strategy: 'desktop' },
        timestamp: new Date(),
        userId: context.userId,
        organizationId: context.organizationId,
      });
    }

    return snapshots;
  }
}
