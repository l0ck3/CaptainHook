import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestService {
  async makeRequest(url, headers) {
    const res = await axios.get(url, {
      headers,
    });

    return res.data;
  }

  async callWebhook(url, payload): Promise<void> {
    await axios.post(url, { body: payload });
  }
}
