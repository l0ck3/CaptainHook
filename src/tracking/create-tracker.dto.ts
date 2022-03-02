export class CreateTrackerDto {
  name: string;
  interval: number;
  trackedUrl: string;
  trackedUrlHeaders: JSON;
  targetUrl: string;
}
