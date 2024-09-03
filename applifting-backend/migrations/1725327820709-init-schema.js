const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitSchema1725327820709 {
    name = 'InitSchema1725327820709'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "comment_votes" ("voteId" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying NOT NULL, "value" integer NOT NULL DEFAULT '0', "comment_id" uuid, CONSTRAINT "PK_7b3547bfeae2fbcfb4707a12a02" PRIMARY KEY ("voteId"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("commentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "author" character varying NOT NULL, "content" character varying NOT NULL, "postedAt" TIMESTAMP NOT NULL DEFAULT now(), "score" integer NOT NULL DEFAULT '0', "article_id" uuid, CONSTRAINT "PK_b302f2e474ce2a6cbacd7981aa5" PRIMARY KEY ("commentId"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("tenantId" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKey" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_30dec5cd2d1f58a2682a9c77bb8" UNIQUE ("apiKey"), CONSTRAINT "PK_5d1f2d0d0b5f5c5e1720082ebbd" PRIMARY KEY ("tenantId"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("articleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "perex" character varying NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedAt" TIMESTAMP DEFAULT now(), "tenant_id" uuid, CONSTRAINT "PK_709f0216840494e847a430f57b7" PRIMARY KEY ("articleId"))`);
        await queryRunner.query(`CREATE TABLE "images" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "mimeType" character varying NOT NULL, "articleArticleId" uuid, CONSTRAINT "REL_a4145c976b7c58095294caaefe" UNIQUE ("articleArticleId"), CONSTRAINT "PK_ec459f275c64a5f69513745e0c8" PRIMARY KEY ("imageId"))`);
        await queryRunner.query(`ALTER TABLE "comment_votes" ADD CONSTRAINT "FK_1b41b98c56a06654513bffc1274" FOREIGN KEY ("comment_id") REFERENCES "comments"("commentId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("articleId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_fa70ef96fb4556d1fd280c7a461" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenantId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_a4145c976b7c58095294caaefe3" FOREIGN KEY ("articleArticleId") REFERENCES "articles"("articleId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_a4145c976b7c58095294caaefe3"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_fa70ef96fb4556d1fd280c7a461"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`);
        await queryRunner.query(`ALTER TABLE "comment_votes" DROP CONSTRAINT "FK_1b41b98c56a06654513bffc1274"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "comment_votes"`);
    }
}
