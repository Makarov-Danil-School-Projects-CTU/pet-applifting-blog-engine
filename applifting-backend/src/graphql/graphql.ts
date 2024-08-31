
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum VoteType {
    UP = "UP",
    DOWN = "DOWN"
}

export class CreateArticleInput {
    title: string;
    perex: string;
    content: string;
    tenantId: string;
}

export class UpdateArticleInput {
    title?: Nullable<string>;
    perex?: Nullable<string>;
    content?: Nullable<string>;
}

export class LoginInput {
    username: string;
    password: string;
}

export class CreateCommentInput {
    articleId: string;
    author: string;
    content: string;
}

export class VoteCommentInput {
    commentId: string;
    vote: VoteType;
}

export class CreateTenantInput {
    name: string;
    password: string;
}

export class Article {
    articleId: string;
    title: string;
    perex: string;
    content: string;
    createdAt: DateTime;
    lastUpdatedAt: DateTime;
    tenant: Tenant;
    comments: Comment[];
}

export abstract class IQuery {
    abstract getArticles(): Nullable<Article[]> | Promise<Nullable<Article[]>>;

    abstract getArticle(articleId: string): Nullable<Article> | Promise<Nullable<Article>>;

    abstract getTenant(tenantId: string): Nullable<Tenant> | Promise<Nullable<Tenant>>;
}

export abstract class IMutation {
    abstract createArticle(input: CreateArticleInput): Article | Promise<Article>;

    abstract updateArticle(articleId: string, input: UpdateArticleInput): Nullable<Article> | Promise<Nullable<Article>>;

    abstract deleteArticle(articleId: string): Nullable<Article> | Promise<Nullable<Article>>;

    abstract login(input: LoginInput): LoginResponse | Promise<LoginResponse>;

    abstract createComment(input: CreateCommentInput): Comment | Promise<Comment>;

    abstract voteComment(input: VoteCommentInput): Comment | Promise<Comment>;

    abstract createTenant(input: CreateTenantInput): Nullable<Tenant> | Promise<Nullable<Tenant>>;
}

export class LoginResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export class Comment {
    commentId: string;
    author: string;
    content: string;
    postedAt: DateTime;
    score: number;
    article: Article;
}

export abstract class ISubscription {
    abstract commentAdded(articleId: string): Comment | Promise<Comment>;

    abstract commentVoted(commentId: string): Comment | Promise<Comment>;
}

export class Tenant {
    tenantId: string;
    apiKey: string;
    name: string;
    createdAt: DateTime;
    lastUsedAt?: Nullable<DateTime>;
    articles: Article[];
}

export type DateTime = any;
type Nullable<T> = T | null;
