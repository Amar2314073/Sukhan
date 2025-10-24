
Poet Routes:
GET /poets - get all poets (public)
GET /poets/:id - get a specific poet (public)
POST /poets - create a poet (admin only)
PUT /poets/:id - update a poet (admin only)
DELETE /poets/:id - delete a poet (admin only)

Category Routes:
GET /categories - get all categories (public)
GET /categories/:id - get a specific category (public)
POST /categories - create a category (admin only)
PUT /categories/:id - update a category (admin only)
DELETE /categories/:id - delete a category (admin only)

Poem Routes:
GET /poems - get all poems (public) with filtering, pagination, search
GET /poems/:id - get a specific poem (public)
POST /poems - create a poem (admin only)
PUT /poems/:id - update a poem (admin only)
DELETE /poems/:id - delete a poem (admin only)
GET /poems/search?q=... - search poems (public)

Collection Routes (admin curated collections):
GET /collections - get all collections (public)
GET /collections/:id - get a specific collection (public)
POST /collections - create a collection (admin only)
PUT /collections/:id - update a collection (admin only)
DELETE /collections/:id - delete a collection (admin only)

Dictionary Routes:
GET /dictionary - get all words (public) with pagination
GET /dictionary/:word - get a specific word (public)
POST /dictionary - create a word (admin only)
PUT /dictionary/:id - update a word (admin only)
DELETE /dictionary/:id - delete a word (admin only)
GET /dictionary/search?q=... - search words (public)

Favorite Routes (user favorites):
GET /favorites - get user's favorites (user only)
POST /favorites - add a poem to favorites (user only)
DELETE /favorites/:poemId - remove a poem from favorites (user only)

UserCollection Routes (user personal collections):
GET /user-collections - get user's collections (user only)
POST /user-collections - create a collection (user only)
GET /user-collections/:id - get a specific user collection (user only, or public if isPublic is true? - we'll do user only for now)
PUT /user-collections/:id - update a user collection (user only)
DELETE /user-collections/:id - delete a user collection (user only)
POST /user-collections/:id/poems - add a poem to a user collection (user only)
DELETE /user-collections/:id/poems/:poemId - remove a poem from a user collection (user only)

We'll create separate route files for each resource. But for now, let's list the routes without code.

We have to decide the base paths:

Poets: /poets

Categories: /categories

Poems: /poems

Collections: /collections

Dictionary: /dictionary

Favorites: /favorites

UserCollections: /user-collections

We'll use:

Public routes: GET methods for reading data

Admin routes: POST, PUT, DELETE for poets, categories, poems, collections, dictionary

User routes: All favorites and user-collections routes (except public sharing) require userMiddleware

Let me know if you want to change any route structure.

Here are the routes you need to create for your Rekhta-like website:

📚 Poet Routes:
GET /poets - Get all poets (public)

GET /poets/:id - Get single poet by ID (public)

GET /poets/era/:era - Get poets by era (Classical/Modern/Contemporary) (public)

POST /poets - Create new poet (admin only)

PUT /poets/:id - Update poet (admin only)

DELETE /poets/:id - Delete poet (admin only)

📖 Poem Routes:
GET /poems - Get all poems with pagination/filters (public)

GET /poems/:id - Get single poem by ID (public)

GET /poems/poet/:poetId - Get poems by specific poet (public)

GET /poems/category/:categoryId - Get poems by category (public)

POST /poems - Create new poem (admin only)

PUT /poems/:id - Update poem (admin only)

DELETE /poems/:id - Delete poem (admin only)

POST /poems/:id/view - Increment poem views (public)

🏷️ Category Routes:
GET /categories - Get all categories (public)

GET /categories/:type - Get categories by type (sher/ghazal/nazm) (public)

POST /categories - Create category (admin only)

PUT /categories/:id - Update category (admin only)

DELETE /categories/:id - Delete category (admin only)

📂 Collection Routes (Admin Curated):
GET /collections - Get all collections (public)

GET /collections/featured - Get featured collections (public)

GET /collections/:id - Get single collection with poems (public)

POST /collections - Create collection (admin only)

PUT /collections/:id - Update collection (admin only)

DELETE /collections/:id - Delete collection (admin only)

POST /collections/:id/poems - Add poem to collection (admin only)

DELETE /collections/:id/poems/:poemId - Remove poem from collection (admin only)

📚 Dictionary Routes:
GET /dictionary - Search words (public)

GET /dictionary/:word - Get word meaning (public)

POST /dictionary - Add new word (admin only)

PUT /dictionary/:id - Update word (admin only)

DELETE /dictionary/:id - Delete word (admin only)

❤️ Favorite Routes (User Likes):
GET /favorites - Get user's favorite poems (user only)

POST /favorites/:poemId - Add poem to favorites (user only)

DELETE /favorites/:poemId - Remove poem from favorites (user only)

GET /favorites/check/:poemId - Check if poem is favorited (user only)

📁 UserCollection Routes (Personal Collections):
GET /user-collections - Get user's collections (user only)

POST /user-collections - Create new collection (user only)

GET /user-collections/:id - Get collection with poems (user only)

PUT /user-collections/:id - Update collection (user only)

DELETE /user-collections/:id - Delete collection (user only)

POST /user-collections/:id/poems - Add poem to user collection (user only)

DELETE /user-collections/:id/poems/:poemId - Remove poem from user collection (user only)

🔍 Search Routes:
GET /search/poems - Search poems by text (public)

GET /search/poets - Search poets by name (public)

GET /search/dictionary - Search dictionary words (public)

🛣️ Route Grouping Suggestions:
You can organize them in separate route files:

poetRoutes.js

poemRoutes.js

categoryRoutes.js

collectionRoutes.js

dictionaryRoutes.js

favoriteRoutes.js

userCollectionRoutes.js

searchRoutes.js

🔐 Middleware Usage:
Public routes: No authentication needed

User routes: userMiddleware required

Admin routes: adminMiddleware required

🎯 Priority Order for Development:
Phase 1 (Core Features):

Poem routes (GET)

Poet routes (GET)

Category routes (GET)

Search routes

Favorite routes

Phase 2 (User Features):
6. UserCollection routes
7. Dictionary routes

Phase 3 (Admin Features):
8. All POST/PUT/DELETE routes for content management

This covers all the functionality you need for a complete Rekhta-like platform!

