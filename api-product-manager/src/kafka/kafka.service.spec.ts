import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';
import { ClientKafka } from '@nestjs/microservices';

describe('KafkaService', () => {
  let service: KafkaService;
  let clientKafka: ClientKafka;

  const mockClientKafka = {
    emit: jest.fn(),
    connect: jest.fn(),
    close: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        {
          provide: 'KAFKA_SERVICE',
          useValue: mockClientKafka,
        },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
    clientKafka = module.get<ClientKafka>('KAFKA_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishMessage', () => {
    it('should call kafkaService.emit with the correct topic and message', () => {
      const topic = 'test-topic';
      const message = { key: 'test-key', value: 'test-value' };

      service.publishMessage(topic, message);

      expect(mockClientKafka.emit).toHaveBeenCalledWith(topic, message);
    });

    it('should return the observable from kafkaService.emit', () => {
      const topic = 'test-topic';
      const message = { key: 'test-key', value: 'test-value' };

      mockClientKafka.emit.mockReturnValue('test-observable');

      const result = service.publishMessage(topic, message);

      expect(result).toBe('test-observable');
    });
  });
});