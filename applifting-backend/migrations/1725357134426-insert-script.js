const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class InsertScript1725357134426 {
  async up(queryRunner) {
    // Insert tenants
    await queryRunner.query(`
      INSERT INTO tenants ("tenantId", "apiKey", "name", "password", "createdAt", "lastUsedAt")
      VALUES
      ('5ba38c85-fb19-4ed3-99bd-8b34cf34705f', 'cfb9e992-c03b-433f-a5e0-6853caf8adda', 'user1', 'ef08310c550f1752.f47a95ae8c86998b375aa1121618ecd558a63bf72f0b93924c4e2d49364a5b91', '2024-09-03T09:48:55.827Z', null),
      ('5025ac03-21d7-414c-a1d9-ab786ba20ca0', '9bf24e9b-7ffb-4cb2-a2e9-2bed25161962', 'user2', '9ebe0171c891681e.85c3b421525fa5d01fb3aa9f653e29e91fa84772a0710d449de526de6e3737e0', '2024-09-03T09:50:00.702Z', null);
    `);

    // Insert articles for tenant '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'
    await queryRunner.query(`
      INSERT INTO articles ("articleId", "title", "perex", "content", "createdAt", "lastUpdatedAt", "tenant_id")
      VALUES
      ('0c475513-5ea4-40b9-8b32-500b0aa818af', 'Article 1', 'Perex 1', 'Content 1', '2024-09-03T10:00:00.000Z', null, '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'),
      ('d8ec9cc7-18be-421f-8a51-33b3ecc33b42', 'Article 2', 'Perex 2', 'Content 2', '2024-09-03T10:00:00.000Z', null, '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'),
      ('a4b41a8a-1a11-4110-9e8b-e4a5bb539e00', 'Article 3', 'Perex 3', 'Content 3', '2024-09-03T10:00:00.000Z', null, '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'),
      ('3b8c0c2c-4cac-46b9-91a8-5456e40b9551', 'Article 4', 'Perex 4', 'Content 4', '2024-09-03T10:00:00.000Z', null, '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'),
      ('b52fecbb-6b7b-4198-8275-27aa4dea3855', 'Article 5', 'Perex 5', 'Content 5', '2024-09-03T10:00:00.000Z', null, '5ba38c85-fb19-4ed3-99bd-8b34cf34705f');
    `);

    // Insert articles for tenant '5025ac03-21d7-414c-a1d9-ab786ba20ca0'
    await queryRunner.query(`
      INSERT INTO articles ("articleId", "title", "perex", "content", "createdAt", "lastUpdatedAt", "tenant_id")
      VALUES
      ('cd18d973-e8b1-4f42-9adf-86519f88d9ec', 'Article A', 'Perex A', 'Content A', '2024-09-03T10:00:00.000Z', null, '5025ac03-21d7-414c-a1d9-ab786ba20ca0'),
      ('34f4dfb7-04c4-424b-bd58-132ef8354af8', 'Article B', 'Perex B', 'Content B', '2024-09-03T10:00:00.000Z', null, '5025ac03-21d7-414c-a1d9-ab786ba20ca0'),
      ('67436be6-1d90-411e-9d71-529b64f7b32d', 'Article C', 'Perex C', 'Content C', '2024-09-03T10:00:00.000Z', null, '5025ac03-21d7-414c-a1d9-ab786ba20ca0'),
      ('f2fef1b7-bbdd-4d0b-9ef4-e4d2c0cb183d', 'Article D', 'Perex D', 'Content D', '2024-09-03T10:00:00.000Z', null, '5025ac03-21d7-414c-a1d9-ab786ba20ca0'),
      ('231267b1-9189-4527-9866-5d7d20f9aeb8', 'Article E', 'Perex E', 'Content E', '2024-09-03T10:00:00.000Z', null, '5025ac03-21d7-414c-a1d9-ab786ba20ca0');
    `);

    // Insert comments for articles of tenant '5ba38c85-fb19-4ed3-99bd-8b34cf34705f'
    await queryRunner.query(`
      INSERT INTO comments ("commentId", "author", "content", "postedAt", "score", "article_id")
      VALUES
      ('e2ff97ab-a79a-4e4d-8f01-15e51f902dbd', 'Author 1', 'Comment 1 for Article 1', '2024-09-03T10:01:00.000Z', 0, '0c475513-5ea4-40b9-8b32-500b0aa818af'),
      ('21c23ff7-89a8-4adf-b043-ea2b075cae42', 'Author 2', 'Comment 2 for Article 1', '2024-09-03T10:02:00.000Z', 0, '0c475513-5ea4-40b9-8b32-500b0aa818af'),
      ('b33b2b2b-ed5d-4ec8-b1e0-6628b11944e6', 'Author 1', 'Comment 1 for Article 2', '2024-09-03T10:03:00.000Z', 0, 'd8ec9cc7-18be-421f-8a51-33b3ecc33b42'),
      ('93728f4e-4088-41e1-b4e9-bb5fe2144746', 'Author 2', 'Comment 2 for Article 2', '2024-09-03T10:04:00.000Z', 0, 'd8ec9cc7-18be-421f-8a51-33b3ecc33b42'),
      ('8b88c8db-2b81-4b41-85d8-6430a361d136', 'Author 1', 'Comment 1 for Article 3', '2024-09-03T10:05:00.000Z', 0, 'a4b41a8a-1a11-4110-9e8b-e4a5bb539e00'),
      ('7d0653f5-0b4c-40b2-ac5f-c174d7a45537', 'Author 2', 'Comment 2 for Article 3', '2024-09-03T10:06:00.000Z', 0, 'a4b41a8a-1a11-4110-9e8b-e4a5bb539e00'),
      ('d603f54e-2e97-4b46-a313-59cf2c3e4930', 'Author 1', 'Comment 1 for Article 4', '2024-09-03T10:07:00.000Z', 0, '3b8c0c2c-4cac-46b9-91a8-5456e40b9551'),
      ('3672fc97-7d59-4357-8272-b605f31de4f2', 'Author 2', 'Comment 2 for Article 4', '2024-09-03T10:08:00.000Z', 0, '3b8c0c2c-4cac-46b9-91a8-5456e40b9551'),
      ('d89ba091-0424-4a24-a9b2-1b61266ba242', 'Author 1', 'Comment 1 for Article 5', '2024-09-03T10:09:00.000Z', 0, 'b52fecbb-6b7b-4198-8275-27aa4dea3855'),
      ('184c3a86-5295-4b11-b143-04bf8bc55cbc', 'Author 2', 'Comment 2 for Article 5', '2024-09-03T10:10:00.000Z', 0, 'b52fecbb-6b7b-4198-8275-27aa4dea3855');
    `);

    // Insert comments for articles of tenant '5025ac03-21d7-414c-a1d9-ab786ba20ca0'
    await queryRunner.query(`
      INSERT INTO comments ("commentId", "author", "content", "postedAt", "score", "article_id")
      VALUES
      ('ee7f9aeb-36d5-40b9-9fd5-61d5c5c974d3', 'Author A', 'Comment 1 for Article A', '2024-09-03T10:01:00.000Z', 0, 'cd18d973-e8b1-4f42-9adf-86519f88d9ec'),
      ('c42927e7-9d5a-45e7-8fbe-cf8d2cf6b5c4', 'Author B', 'Comment 2 for Article A', '2024-09-03T10:02:00.000Z', 0, 'cd18d973-e8b1-4f42-9adf-86519f88d9ec'),
      ('5b8e728d-9050-4bde-9b6e-9c07e25d842f', 'Author A', 'Comment 1 for Article B', '2024-09-03T10:03:00.000Z', 0, '34f4dfb7-04c4-424b-bd58-132ef8354af8'),
      ('7f8e2d32-1a4b-4f24-a8b9-4fbff2566f25', 'Author B', 'Comment 2 for Article B', '2024-09-03T10:04:00.000Z', 0, '34f4dfb7-04c4-424b-bd58-132ef8354af8'),
      ('cd8c3245-4319-4242-8cc3-c0f02398b64b', 'Author A', 'Comment 1 for Article C', '2024-09-03T10:05:00.000Z', 0, '67436be6-1d90-411e-9d71-529b64f7b32d'),
      ('18af5b7e-9e2e-48b2-beb3-c687d8f853df', 'Author B', 'Comment 2 for Article C', '2024-09-03T10:06:00.000Z', 0, '67436be6-1d90-411e-9d71-529b64f7b32d'),
      ('af83e137-0913-41d1-bd88-bf5f1b9dbe3a', 'Author A', 'Comment 1 for Article D', '2024-09-03T10:07:00.000Z', 0, 'f2fef1b7-bbdd-4d0b-9ef4-e4d2c0cb183d'),
      ('1ea2d329-13d3-448d-9393-eae1b8f919b4', 'Author B', 'Comment 2 for Article D', '2024-09-03T10:08:00.000Z', 0, 'f2fef1b7-bbdd-4d0b-9ef4-e4d2c0cb183d'),
      ('b61e99b4-1cb3-4f8c-bdc9-9fbb893647af', 'Author A', 'Comment 1 for Article E', '2024-09-03T10:09:00.000Z', 0, '231267b1-9189-4527-9866-5d7d20f9aeb8'),
      ('78d3ea1e-44e5-4c3d-b3a7-9f8cb8c8d5e9', 'Author B', 'Comment 2 for Article E', '2024-09-03T10:10:00.000Z', 0, '231267b1-9189-4527-9866-5d7d20f9aeb8');
    `);
  }

  async down(queryRunner) {
    // Delete comments
    await queryRunner.query(`
      DELETE FROM comments 
      WHERE "commentId" IN (
        'e2ff97ab-a79a-4e4d-8f01-15e51f902dbd', '21c23ff7-89a8-4adf-b043-ea2b075cae42', 'b33b2b2b-ed5d-4ec8-b1e0-6628b11944e6', '93728f4e-4088-41e1-b4e9-bb5fe2144746', '8b88c8db-2b81-4b41-85d8-6430a361d136', '7d0653f5-0b4c-40b2-ac5f-c174d7a45537', 'd603f54e-2e97-4b46-a313-59cf2c3e4930', '3672fc97-7d59-4357-8272-b605f31de4f2', 'd89ba091-0424-4a24-a9b2-1b61266ba242', '184c3a86-5295-4b11-b143-04bf8bc55cbc',
        'ee7f9aeb-36d5-40b9-9fd5-61d5c5c974d3', 'c42927e7-9d5a-45e7-8fbe-cf8d2cf6b5c4', '5b8e728d-9050-4bde-9b6e-9c07e25d842f', '7f8e2d32-1a4b-4f24-a8b9-4fbff2566f25', 'cd8c3245-4319-4242-8cc3-c0f02398b64b', '18af5b7e-9e2e-48b2-beb3-c687d8f853df', 'af83e137-0913-41d1-bd88-bf5f1b9dbe3a', '1ea2d329-13d3-448d-9393-eae1b8f919b4', 'b61e99b4-1cb3-4f8c-bdc9-9fbb893647af', '78d3ea1e-44e5-4c3d-b3a7-9f8cb8c8d5e9'
      );
    `);

    // Delete articles
    await queryRunner.query(`
      DELETE FROM articles 
      WHERE "articleId" IN (
        '0c475513-5ea4-40b9-8b32-500b0aa818af', 'd8ec9cc7-18be-421f-8a51-33b3ecc33b42', 'a4b41a8a-1a11-4110-9e8b-e4a5bb539e00', '3b8c0c2c-4cac-46b9-91a8-5456e40b9551', 'b52fecbb-6b7b-4198-8275-27aa4dea3855',
        'cd18d973-e8b1-4f42-9adf-86519f88d9ec', '34f4dfb7-04c4-424b-bd58-132ef8354af8', '67436be6-1d90-411e-9d71-529b64f7b32d', 'f2fef1b7-bbdd-4d0b-9ef4-e4d2c0cb183d', '231267b1-9189-4527-9866-5d7d20f9aeb8'
      );
    `);

    // Delete tenants
    await queryRunner.query(`
      DELETE FROM tenants 
      WHERE "tenantId" IN ('5ba38c85-fb19-4ed3-99bd-8b34cf34705f', '5025ac03-21d7-414c-a1d9-ab786ba20ca0');
    `);
  }
};
