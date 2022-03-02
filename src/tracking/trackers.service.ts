import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './create-tracker.dto';
import { RequestService } from './request.service';
import { Tracker } from './tracker.entity';

@Injectable()
export class TrackersService {
  constructor(
    @InjectRepository(Tracker)
    private trackersRepository: Repository<Tracker>,
    private schedulerRegistry: SchedulerRegistry,
    private requestService: RequestService,
  ) {}

  findAll(): Promise<Tracker[]> {
    return this.trackersRepository.find();
  }

  async create(params: CreateTrackerDto): Promise<Tracker> {
    const tracker = await this.trackersRepository.save(params);
    this.startTracking(tracker);

    return tracker;
  }

  async delete(id: number): Promise<void> {
    const tracker = await this.trackersRepository.findOne(id);
    this.schedulerRegistry.deleteInterval(`${tracker.id}-${tracker.name}`);
    await this.trackersRepository.delete(tracker);
  }

  async startAllTrackers(): Promise<void> {
    const trackers = await this.findAll();
    trackers.forEach((tracker) => this.startTracking(tracker));
  }

  private startTracking(tracker: Tracker) {
    const { id, name, interval, trackedUrl, trackedUrlHeaders, targetUrl } =
      tracker;
    const callback = async () => {
      const res = await this.requestService.makeRequest(
        trackedUrl,
        trackedUrlHeaders,
      );

      const hash = createHash('md5').update(JSON.stringify(res)).digest('hex');

      if (tracker.latestResponseHash !== hash) {
        tracker.latestResponseHash = hash;
        this.trackersRepository.save(tracker);
        this.requestService.callWebhook(targetUrl, res);
      }
    };

    const scheduledInterval = setInterval(callback, interval);
    this.schedulerRegistry.addInterval(`${id}-${name}`, scheduledInterval);
  }
}
