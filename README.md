This is a blogging application with which users can view all blogs and particular blogs without
login. But if a user needs to make, update, or delete a blog they are required to login first. A user
can update, delete their own blogs only. The application url is https://rich-blue-starfishcape.cyclic.app/. To create, update or delete a blog an access token is required, the token most
start with “Bearer”.

2. /signin: use to authenticate user. It a post request that takes body parameters (username,
   password)
3. /logout: get request to logout user
4. /refresh: get request to fetch refresh token from db
5. /getArticles: get request which return a list of articles
6. /getArticles/:id: get request that return specific article
7. /articles: post request to add an article. It takes body parameters (title, content, user
   (which is the id of the user making the request)). It requires and access token to make
   this request.
8. /articles/:id patch request that updates an existing article. It takes body parameter (title,
   content, user) and the bloger id as request param. Also requires an access token
9. /article/:id: delete request that takes and user id as request pram
