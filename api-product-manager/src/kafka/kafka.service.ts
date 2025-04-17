import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    ) { }

    publishMessage(toopic: string, message: any) {
        return this.kafkaService.emit(toopic, message);

    }
}
