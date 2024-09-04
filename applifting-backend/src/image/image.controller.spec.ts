import { Test, TestingModule } from '@nestjs/testing';
import { createReadStream } from 'fs';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Tenant } from '../entities/tenant.entity';

const mockImage = {
  imageId: '1',
  name: 'test-image.png',
  mimeType: 'image/png',
  article: { articleId: '99a0de2e-6efb-4f16-9604-812e2dd6e1aa' },
  url: 'http://localhost/uploads/test-image.png',
};

const mockFile = {
  originalname: 'test-image.png',
  mimetype: 'image/png',
  buffer: Buffer.from('test'),
  size: 1024,
} as Express.Multer.File;

const mockTenant = {
  tenantId: '1',
  name: 'Test Tenant',
  apiKey: 'abc123',
  createdAt: new Date(),
  lastUsedAt: null,
  articles: [],
  password: 'salt.hashpassword',
  comments: [], 
  commentVotes: [], 
  image: null
};

const mockImageService = {
  uploadImage: jest.fn().mockResolvedValue(mockImage),
  getImageById: jest.fn().mockResolvedValue({
    file: createReadStream(Buffer.from('test')),
    mimeType: 'image/png',
    filename: 'test-image.png',
    size: mockFile.size,
  }),
  deleteImage: jest.fn().mockResolvedValue(mockImage),
};

describe('ImageController', () => {
  let controller: ImageController;
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: mockImageService,
        },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload an image', async () => {
    const articleId = '99a0de2e-6efb-4f16-9604-812e2dd6e1aa';

    const result = await controller.uploadImage(articleId, mockFile, mockTenant);

    expect(service.uploadImage).toHaveBeenCalledWith(
      {
        articleId,
        name: mockFile.originalname,
        mimeType: mockFile.mimetype,
      },
      mockFile,
      mockTenant.tenantId
    );
    expect(result).toEqual(mockImage);
  });
});
