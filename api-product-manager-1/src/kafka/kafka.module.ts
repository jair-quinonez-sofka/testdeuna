import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [KafkaService],
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId  : 'product-manager-kafka-client',
            brokers: ['kafka:29092'],
            requestTimeout: 5000,
          },
          consumer: {
            groupId: 'product-manager-kafka-group',
          },
        },
      },
    ]),
  ],
  exports:[KafkaService],
})
export class KafkaModule {}
