import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { Tracker } from './tracker.entity';
import { TrackersController } from './trackers.controller';
import { TrackersService } from './trackers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker]), HttpModule],
  controllers: [TrackersController],
  providers: [TrackersService, SchedulerRegistry, RequestService],
})
export class TrackingModule {
  constructor(private trackersService: TrackersService) {
    this.trackersService.startAllTrackers();
  }
}
