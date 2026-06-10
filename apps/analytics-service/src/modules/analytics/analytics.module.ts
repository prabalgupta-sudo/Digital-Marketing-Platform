import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsResolver } from './resolvers/analytics.resolver';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { KPI, KPISchema } from './entities/kpi.entity';
import { Analytics, AnalyticsSchema } from './entities/analytics.entity';

/**
 * AnalyticsModule - Encapsulates all analytics-related functionality
 * Demonstrates Module Pattern and Dependency Injection
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KPI.name, schema: KPISchema },
      { name: Analytics.name, schema: AnalyticsSchema },
    ]),
  ],
  providers: [
    AnalyticsResolver,
    AnalyticsService,
    AnalyticsRepository,
  ],
  exports: [
    AnalyticsService,
    AnalyticsRepository,
  ],
})
export class AnalyticsModule {}
