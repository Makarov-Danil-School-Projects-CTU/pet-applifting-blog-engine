# 🚀 Applifting Test Assignment

This project is part of a test assignment for the company **Applifting**. The original task can be found [here](https://github.com/Applifting/fullstack-exercise/blob/master/assignment.md). The task is to implement a simple single-user blog engine in Node.js. The original assignment is intentionally broad, allowing for creativity and the opportunity to showcase technical skills. For this project, I defined the following objectives:

1. **Implement authentication**
2. **Define entities:** tenant, article, comment, image, and implement simple validation and CRUD operations for them.
3. **Add features for articles and comments:** Allow users to add comments to articles. Enable Reddit-style upvote and downvote functionality for comments. Votes should be unique and identified by IP address. Use GraphQL Subscriptions and WebSockets for adding comments and votes.
4. **Implement multitenancy:** Our content (articles, comments, images) will be accessible only to us.
5. **Architecture:** Design both REST API and GraphQL endpoints.
6. **Containerization:** Dockerize the application.
7. **Testing:** Implement testing environment, unit and E2E (End-to-End) tests.

## 🛠️ Technologies Used

- NestJS
- TypeORM
- Apollo GraphQL
- GraphQL Subscriptions
- WebSockets
- Docker
- PostgreSQL
- Jest

## How to run a project?

```
docker compose up -d --build
```

After that you can use:

1. `localhost:4000/api-docs` – for a documenation
2. `localhost:4000/graphql` – enter Apollo Playground
3. or use `localhost:4000` in Postman to play with REST API

### ⚠️ATTENTION!⚠️

If you want to use GraphQL, keep ValidationPipe commented in app.module.ts like this:

```⚠️
 providers: [
    // Comment if we work with graphql
    // this validation pipe does not pass graphql requests
    //  {
    //    provide: APP_PIPE,
    //    useValue: new ValidationPipe({
    //      whitelist: true
    //  }),
    },
  ],
```

For the REST API you can uncomment these lines. The reason is that ValidationPipe wrongly cuts request body for GraphQL, but for REST API it's ok.

## 💡 Solution

### 1. **Authentication**

This project uses an external API to register users (referred to as tenants). To access our own “space”, we need to send a POST request to https://fullstack.exercise.applifting.cz/tenants with JSON body:

```
{
  "name": "your-new-tenant-name",
  "password": "your-new-tenant-password"
}
```

The response will contain an **apiKey** field. This API key is used to identify our tenant when using any other API endpoint.
After creating a tenant, we can log in by sending a request with the same body used to create the user:

```
{
  "username": "your-new-tenant-name",
  "password": "your-new-tenant-password"
}
```

We also need to include an **X-API-KEY** header with the received apiKey from the server. If successful, the response will contain an **access_token** field. This token expires in an hour and is used to access all protected API routes.

To store the **access_token**, I created an in-memory token store with logic for storing, deleting, and validating tokens. This is sufficient for our needs since we are building a single-user blog application. The **auth** and **tenant** NestJS modules handle login requests and tenant creation.

### 2. **Defining Entities and Implementing CRUD Operations**

**Key Entities:**

**Tenant**: Represents a user that owns the content in the blog application. Each tenant has a unique **tenantId**, **apiKey**, **name**, **password**, and timestamps for when they were created and last used. Tenants also have associations with their articles, comments, and comment votes.

**Article**: Represents a blog post created by a tenant. Articles have fields such as **articleId**, **title**, **perex**, **content**, **createdAt**, and **updatedAt**, along with a reference to the tenant, that owns the article, comments and image.

**Comment**: Represents a comment made on an article. Each comment has a **commentId**, **author**, **content**, **postedAt**, and **score** for voting, as well as references to the article it belongs to and the tenant who made it.

**Image**: Represents image that might be associated with article. Images have an **imageId**, **name**, **url**, and **mimeType**. This entity will also be linked to the tenant and potentially to the articles.

**CommentVote**: Represents a vote on a comment. Each vote has a **voteId**, **value** (indicating upvote or downvote), **ipAddress** for uniqueness, and references to the associated comment and tenant. This additional entity was implemented for easy handling user votes by IP address.

Using TypeORM, we define each entity as a class decorated with **@Entity()** and various field decorators like **@PrimaryGeneratedColumn()**, **@Column()**, **@ManyToOne()**, and **@OneToMany()**. This schema definition allows TypeORM to automatically handle database table creation and relationships based on these classes.

### 3. **Adding Comments and Votes with GraphQL Subscriptions**

I created a GraphQL mutation to allow adding comments. This mutation receives the comment details (like articleID, author, and content) and stores the new comment in the **PostgreSQL** database.

I also used **GraphQL Subscriptions** to broadcast new comments in real-time to all connected clients. This ensures that users see new comments immediately without needing to refresh their pages.

For validation purposes, I used decorators such as **@IsString()**, **@IsUUID()**, **@Length()** etc on **Data Transfer Objects (DTOs)**.

**Voting on Comments with GraphQL Subscriptions:**

Implement another GraphQL mutation to handle upvotes and downvotes on comments. The mutation checks if a vote from the same IP address already exists for the comment. If not, it creates a new vote record and adjusts the comment's score accordingly.

**WebSocket Integration:**

The same functionality was implemented with WebSockets in **comment.gateway.ts** file for handling real-time data flow between the server and clients. Uncomment this file if you want to use websockets with REST API. Otherwise, use GraphQL Subscription. When a new comment or vote is made, the server pushes updates to all connected clients instantly.

### 4. **Implementing Multitenancy**

All API requests are made with an **X-API-KEY** header that identifies the tenant. This key is essential for ensuring that tenants only interact with their own data, maintaining a strict separation between different users' content. TypeORM allows us to easily add conditions to our queries to enforce tenant-specific data access, ensuring that any operation (whether it's creating, reading, updating, or deleting data) respects this isolation.

**🛡️ Guards and Middlewares:**

**AccessToken Guard:** 

This guard is used to check for the presence and validity of an access token in the request headers. In our GraphQL API, the AccessTokenGuard ensures that only authenticated users can access protected routes by verifying the Authorization header. If the token is missing or invalid, the request is denied.

**ApiKey Guard:** 

Similarly, the ApiKeyGuard checks for the presence of the **X-API-KEY** header, which is necessary to identify the tenant. This guard is crucial for any GraphQL operations, ensuring that each tenant can only access their specific data.

**AccessToken and ApiKey Middlewares:**

For the REST API, we use middleware to handle the same checks that the guards perform in GraphQL. The **AccessTokenMiddleware** verifies the access token's presence and validity, while the **ApiKeyMiddleware** checks the **X-API-KEY** header.

**CurrentTenant Middleware:**

This middleware plays a key role in identifying the current tenant based on the **X-API-KEY** header in the request. When a request is made, the CurrentTenant middleware extracts the **X-API-KEY**, queries the database to find the corresponding tenant, and attaches this tenant to the request object.

**Custom Decorator:**

I created a custom decorator that works with the CurrentTenant middleware. This decorator makes it easy to inject the current tenant directly into controller methods, promoting cleaner and more readable code.

### 5. Designing REST API and GraphQL (schema-first approach)

To provide a flexible API layer, I defined a GraphQL schema using the schema-first approach, which includes types, queries, mutations, and subscriptions. This method demonstrates my understanding of GraphQL as I write pure GraphQL schemas that are independent of the platform. You can find the implementation under **graphql** directory in a project.

### 6. Dockerizing the Application

.Docker and docker-compose.yml files were created to run NestJS and PostgreSQL simultaneously. To start a program, launch Docker and type a command in a console:

```
docker compose up -d --build
```

### 7. Implementing Unit and End-to-End (E2E) Tests

**🌍 Multi-Environment Setup for Development and Testing**

To facilitate smooth development and testing processes, I created two distinct environments: one for development and one for testing.
- `npm run start:dev` to run dev environment,
- `npm run test` to run unit tests
- `npm run test:e2e` to run E2E tests


**🔍 Unit Tests**

I wrote unit tests for each individual service and controller. By mocking dependencies, I isolated the functionality of each component, ensuring that tests are fast and reliable without external dependencies affecting the results.

**🚀 End-to-End (E2E) Tests**

To cover some application workflow, I wrote E2E tests. These tests simulate real-world scenarios from start to finish, making API requests and validating the final outcomes directly in the database.
