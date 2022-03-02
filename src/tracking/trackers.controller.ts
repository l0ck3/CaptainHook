import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTrackerDto } from './create-tracker.dto';
import { Tracker } from './tracker.entity';
import { TrackersService } from './trackers.service';

@Controller('trackers')
export class TrackersController {
  constructor(private readonly trackersService: TrackersService) {}

  @Get()
  async listTrackers(): Promise<Tracker[]> {
    return await this.trackersService.findAll();
  }

  @Post() async createTracker(
    @Body() createTrackerDto: CreateTrackerDto,
  ): Promise<Tracker> {
    return await this.trackersService.create(createTrackerDto);
  }

  @Delete(':id')
  async deleteTracker(@Param('id') id: number) {
    this.trackersService.delete(id);
  }
}
