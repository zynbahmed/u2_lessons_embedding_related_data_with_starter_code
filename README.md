
<img src="https://i.imgur.com/cD5R8OG.png" width="600px;display:inline-block;margin:auto">

# Mongoose<br>Embedding Related Data

## Learning Objectives

| Students Will Be Able To:                   |
| ------------------------------------------- |
| Define Schemas for Embedding Subdocuments   |
| Embed a Subdocument in its Related Document |

## Road Map

1. Setup
2. Review the Starter Code
3. The `Movie --< Review` Relationship
4. Subdocuments
5. Define a Schema for Review Subdocuments
6. Creating Reviews
7. Displaying Reviews
8. Essential Questions
9. Further Study
	- Retrieve a Subdocument from a Mongoose Array
	- Remove a Subdocument from a Mongoose Array
	- Query for a Document that Contains a Certain Subdocument

## 1. Setup

1. Fork and clone this repo.  
3. `cd` into *u2_lessons_embedding_related_data_with_starter_code* and then *mongoose movies*
4. `npm i` to install the necessary dependencies for the project to run. 
5.  `touch` a `.env` file
6.  Copy over your `DATABASE_URL` from yesterday's **intro to mongoose** code. 

## 2. Review the Starter Code

As you can see, a navigation bar and a bit of styling has been added since the previous lesson.

There's no more "Home" page - the root route is redirecting to `/movies` (movies index functionality).

All `res.render()` calls are passing in a `title` property that's being used for the page title and to dynamically add an `active` class to the links in the nav bar.

Like we did in the mongoose-todos, **show** functionality has been added using a **show** route definition that maps to a `show` controller action for viewing a single movie:

- **views/movies/index.ejs** shows a "DETAILS" link that will send a request to the proper `show` route: `GET /movies/:id`.

- EJS tags write the movie's `_id` into the `href` attribute.

- The `moviesCtrl.show` action is using the `Movie.findById` method and `req.params.id`.

## 3. The `Movie --< Review` Relationship

**`Movie --< Review`**

- _A Movie has many Reviews_
- _A Review belongs to a Movie_

It is helpful to consider direction when considering data relationships. For example, a movie will most likely have multiple reviews, however a single review would never be applicable for multiple movies, If I review one movie, my movie review isn't going to make sense if it is applied to a different Movie, as well, I am very likely not the only person reviewing the movie I just reviewed, so it makes sense that a single movie would have multiple reviews that are obviously only reviewing that same movie. This is an example of a one to many relationship from the perspective of movies to reviews.

It is important to think about data relationships from one piece of data to another. When we talk further on one to one, one to many and many to many relationships, you may notice that a many to many relationship looks a lot like two one to many relationships and that a one to one relationship looks a lot like a one to many relationship with only two items. There is nuance to these relationships and understanding those nuances is the only way you can design your database in a way that works for your project's goals.


### Embed or Reference Reviews?

If `mongoose-movies` was using a SQL Database there would have to be both a `Movie` and a `Review` model used to perform CRUD data operations in a "movies" and "reviews" table.

However, when implementing related data using MongoDB/Mongoose, we have a choice between **embedding** and **referencing**...

#### Referencing Reviews

**Referencing** allows us to "link" related documents by storing one of the document's `ObjectId` in the other document.

Here's what using **referencing** to relate a movie and its reviews might look like:

```js
// A movie document stored
// in the movies collection
{
  nowShowing: false,
  _id: new ObjectId("633e094fa9ba1e2600e6c9f6"),
  title: 'Star Wars - A New Hope',
  releaseYear: 1977,
  cast: ['Mark Hamill', 'Carrie Fisher'],
  createdAt: 2021-10-05T22:46:39.860Z,
  updatedAt: 2021-10-05T22:46:39.860Z,
  __v: 0
}
```
and its reviews might look something like this:
```js
// A review document stored
// in the reviews collection
{
  _id: new Object("605d17435dc2532a429a17d0"),
  // Store/reference the ObjectId
  // of the movie doc that it belongs to
  movie: new ObjectId("633e094fa9ba1e2600e6c9f6"),
  content: 'Still my favorite!',
  rating: 5,
  createdAt: 2022-11-03T13:00:44.130Z,
  updatedAt: 2022-11-03T13:00:44.130Z,
}
// Another review document
{
  _id: new Object("anotherArbitraryId408415650"),
  movie: new ObjectId("633e094fa9ba1e2600e6c9f6"),
  content: 'Entertaining...',
  rating: 4,
  createdAt: 2022-04-01T11:20:44.130Z,
  updatedAt: 2022-04-01T11:20:44.130Z,
}
```

Note that the above scenario stores reviews and movies in separate collections.

Because only a single collection can be queried at a time, this requires two separate database queries if we want access to both a movie and its reviews.

This is the reason embedding is considered more efficient in certain scenarios, particularly when data retrieval involves frequent access to related information within the same document. However, it's essential to note that embedding is not always the best choice when designing relationships between entities in a database. There are cases where referencing data, linking documents through identifiers, offers advantages such as improved consistency, flexibility, and easier updates. The decision between embedding and referencing depends on factors like data size, update frequency, and the nature of queries.

### Example Scenario

Consider a scenario where you have a collection of blog posts and comments. Embedding comments within each blog post may be efficient if comments are relatively small and updated infrequently. On the other hand, referencing comments by their unique identifiers may be more suitable if comments are extensive or frequently updated. It's crucial to carefully analyze the specific requirements of your application and the nature of your data to make an informed decision.

### Embedding Data

- **Efficiency in Read Operations:** Embedding is efficient when data retrieval frequently involves accessing related information within the same document. This minimizes the need for complex joins or multiple queries.
  
- **Improved Performance:** Embedded documents can be retrieved with a single query, reducing the number of database operations and improving performance.

- **Consistency:** Since related data is stored together, changes to one document can be atomic, ensuring consistency within the document.

### Referencing Data

- **Flexibility in Querying:** Referencing allows for more flexibility in querying and aggregating data. You can perform complex queries and aggregations across documents easily.

- **Easier Updates:** Referencing simplifies updates to related data. Changes can be made to a single document, and the updates automatically apply to all references.

- **Reduced Data Redundancy:** Referencing avoids data redundancy by storing shared information in separate documents. This can be beneficial for large datasets.

### Considerations

- **Data Size:** Consider the size of the embedded data. If the embedded data is large and frequently updated, referencing may be more suitable.

- **Update Frequency:** If the related data is updated frequently, referencing allows for more efficient updates without duplicating information.

- **Nature of Queries:** Evaluate the types of queries your application needs to perform. If your queries involve frequent access to related data, embedding may be more efficient.

- **Scalability:** Consider the scalability of your data. As your dataset grows, the choice between embedding and referencing may have implications for performance and storage.

### Embedding Data is an Example of a Denormalized Data Structure

In denormalized data structures, redundant data is intentionally introduced to improve read performance. While it can enhance query speed, it may complicate updates due to said redundancy. Denormalization is a trade-off, suitable for scenarios where read efficiency is a top priority, and data updates are less frequent or critical.  Situations that prioritize fast and efficient read operations, tolerate some level of redundancy, involve infrequent updates, and benefit from simplified queries are well-suited for denormalized data structures. 

Consider an analystics app.  In the context of an analytics dashboard presenting real-time data and insights, where complex queries and aggregations on extensive datasets are essential for meaningful visualizations, prioritizing read efficiency becomes crucial. The application's emphasis is on retrieving and presenting insights from historically collected data, diminishing the necessity for frequent updates to documents. The primary focus lies in optimizing the speed and efficiency of data retrieval to deliver timely and valuable information to users.

### Normalized vs. Denormalized Data Structures

**Normalized Data Structure:**

- **Minimized Redundancy:** Normalization reduces redundancy for improved data integrity.
  
- **Data Integrity:** Breaks down data into smaller tables to maintain integrity.
  
- **Efficient Updates:** Updates are straightforward but may involve joins for complex queries.

**Denormalized Data Structure:**

- **Improved Read Performance:** Enhances query speed by intentionally introducing redundancy.
  
- **Simplified Queries:** Queries are often simpler due to consolidated data.
  
- **Increased Storage:** May lead to increased storage due to redundancy.

### Considerations

- **Read vs. Write Operations:** Balance between read and write operations influences the choice.
  
- **Data Size and Complexity:** Denormalization might be suitable for smaller datasets or applications where simplicity in querying is crucial.
  
- **Updates and Maintenance:** Normalized structures make updates more straightforward, while denormalized structures can complicate updates due to redundant data.
  
- **Use Case Specific:** There is no one-size-fits-all solution. The decision between normalized and denormalized structures depends on the specific requirements and use cases of the application.

In summary, the choice between embedding and referencing, as well as normalized and denormalized structures, involves careful consideration of various factors and usually involves domain expertise in order to make informed decisions. Analyze your application's specific needs, data characteristics, and usage patterns to determine the most suitable approach for designing relationships between entities in your database.

### Embedding Reviews

In MongoDB/Mongoose, one-to-many relationships can be implemented using **embedding**.

Embedding is when a child subdocument (review) is  **embedded** within its parent document (movie).

For example:

```js
{
  nowShowing: false,
  _id: new ObjectId("633e094fa9ba1e2600e6c9f6"),
  title: 'Star Wars - A New Hope',
  releaseYear: 1977,
  cast: ['Mark Hamill', 'Carrie Fisher'],
  reviews: [
    {
      _id: new Object("605d17435dc2532a429a17d0"),
      content: 'Still my favorite!',
      rating: 5,
      createdAt: 2022-11-03T13:00:44.130Z,
      updatedAt: 2022-11-03T13:00:44.130Z,
    },
    {
      _id: new Object("anotherArbitraryId408415650"),
      content: 'Entertaining...',
      rating: 4,
      createdAt: 2022-04-01T11:20:44.130Z,
      updatedAt: 2022-04-01T11:20:44.130Z,
    },
  ],
  createdAt: 2021-10-05T22:46:39.860Z,
  updatedAt: 2021-10-05T22:46:39.860Z,
  __v: 0
}
```

Yep, when using MongoDB/Mongoose, the `Movie --< Review` relationship is a perfect use case for embedding related data!

### ERD for `mongoose-movies`

Here's what an ERD that models the<br>`Movie --< Review`<br>relationship might look like:

<img src="https://i.imgur.com/NqDxv0G.png">

## Subdocuments

When we embed related data, we refer to that embedded data as a **subdocument**.

Subdocuments are very similar to regular documents.

The key difference being that they themselves are not saved directly to the database - they are saved when the document they are embedded within is saved.

Subdocuments still require that a **schema** be defined so that the application can depend upon the "shape" of its data.

However, because subdocuments are not saved to a collection, **there is no model**, just a schema!

## 5. Define a Schema for Review Subdocuments

Okay, so we need to define a `reviewSchema`.

Only the `movieSchema` code needs to reference `reviewSchema`, so a great place to define it is just above the `movieSchema` in **models/movie.js**:

```js
const reviewSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  }
}, {
  timestamps: true
});

const movieSchema = new Schema({
```

With `reviewSchema` defined, we can now use it within the `movieSchema` as follows:

```js
const movieSchema = new Schema({
  ...
  nowShowing: { type: Boolean, default: false },
  // reviews is an array of review subdocs!
  reviews: [reviewSchema]
}, {
  timestamps: true
});
```

<details>
<summary>
👀 Do you need to sync your code?
</summary>
<hr>

**`git reset --hard origin/sync-8-review-schema`**

<hr>
</details>

## 6. Creating Reviews

Here's the User Story:

_**AAU, when viewing the detail page for a movie, I want to see a form for adding a new review**_

Since we will be displaying the form for creating a new review on each movie's detail page (**show.ejs**), we won't need to implement `new` functionality for the reviews resource, thus:

- No route in `routes/reviews.js` for showing a page with a form.
- No `new` controller action in `controllers/reviews.js`
- No `views/reviews/new.ejs` template. In fact, in mongoose-movies, there's no need to even create a `views/reviews` folder.

Cool, so there's no `new` functionality code for reviews, but we certainly need to implement the `create` functionality.

Let's get coding!

### Step 1 - Determine the Proper Route

Routing for a related, also called a nested resource, can be a bit different because we might need to "inform" the server of the nested resource's parent resource.

Let's review the [Routing for Nested Resources section of our Routing Guide](https://gist.github.com/jim-clark/17908763db7bd3c403e6#routing-for-nested-resources-onemany--manymany-relationships).

Using the chart, we find that the proper route for creating a review is:

```
POST /movies/:id/reviews
```

Note how the path of the route will provide the server with the `_id` of the movie that the review is being created for!

### Step 2 - Create the UI that Sends the Request

<details>
<summary>
❓ What UI did we use to create a To Do?
</summary>
<hr>

**A `<form>` element**

<hr>
</details>

Cool, so let's add the form to **movies/show.ejs** right under the current `</section>` tag:

```html
</section>
<!-- new markup below -->
<br><br><h2>Reviews</h2>
<form id="add-review-form" method="POST"
  action="/movies/<%= movie._id %>/reviews">
  <label>Review:</label>
  <textarea name="content"></textarea>
  <label>Rating:</label>
  <select name="rating">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5" selected>5</option>
  </select>
  <input type="submit" value="Add Review">
</form>
```

Nothing new above, but be sure to review how the value for the `action` is being written.  

A touch of styling. **Update** this existing CSS rule on line 69:

```css
#new-form *, #add-review-form * {
  font-size: 20px;
  ...
```

and **add** this new CSS to the bottom:

```css
#add-review-form {
  display: grid;
  grid-template-columns: auto auto;
  gap: 1rem;
}

#add-review-form input[type="submit"] {
  width: 8rem;
  grid-column: 2 / 3;
  margin-bottom: 2rem;
}
```

Browse to the "details" of a movie.

Yeah, not too pretty but the form's `action` attribute looks pretty sweet!

### Step 3 - Define the Route on the Server

As a best practice, let's create a dedicated router module for the reviews resource:

```
touch routes/reviews.js
```

and start with the typical router boilerplate:

```js
const express = require('express');
const router = express.Router();
// You Do - Require the yet to be created reviews controller 


// You Do - Define the Route below


module.exports = router;
```

**👉 You Do - Finish the Router Code Above <small>(1 min)</small>** 

1. Require the reviews controller (yet to be created).

2. Define the route we just identified for creating a review.

<hr>

Now let's require the new router in **server.js**:

```js
const moviesRouter = require('./routes/movies');
// new reviews router
const reviewsRouter = require('./routes/reviews');
```

Before we mount the new router in **server.js**, let's take another look at the paths in [Routing for Nested Resources section of our Routing Guide](https://gist.github.com/jim-clark/17908763db7bd3c403e6#routing-for-nested-resources-onemany--manymany-relationships).

Notice how some paths need to start with the parent resource (`posts`) and others with the nested resource `comments`?

Because of the "starts with" path varies, we won't be able to mount the reviews router in **server.js** to any particular path.

Instead, to achieve the flexibility we need, we have to mount to a starts with path of `/`:

```js
app.use('/movies', moviesRouter);
// Mount the reviews router to root to provide the
// flexibility necessary for nested resources
app.use('/', reviewsRouter);
```

As you know, the server won't be happy until we create and export that `create` action from the controller...

### Step 4 - Create and Code the Controller Action

Let's create the controller module:

```
touch controllers/reviews.js
```

Open the new **controllers/reviews.js** and let the coding commence:

```js
const Movie = require('../models/movie');

module.exports = {
  create
};
```
	
Note that although we don't have a `Review` model thanks to using embedding, we will certainly need to require the `Movie` model because we will need it to read and update the movie document that we're adding a review to.

Let's write the `create` function:
	
```js
async function create(req, res) {
  try {
    const movie = await Movie.findById(req.params.id);
    // we push an object with the data for the 
    // review sub-doc into Mongoose arrays
    movie.reviews.push(req.body);
    // Not saving sub-doc, but the top level document.
    const updatedMovie = await movie.save();
    res.redirect(`/movies/${updatedMovie._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}
```

Yes, we simply push in an object that's compatible with the embedded document's schema, call `save` on the parent doc, and redirect to wherever makes sense for the app.

Before we start adding reviews, let's update the **show.ejs** template to render a movie's reviews...

<details>
<summary>
👀 Do you need to sync your code?
</summary>
<hr>

**`git reset --hard origin/sync-9-create-review`**

<hr>
</details>

## 7. Displaying Reviews

Here's the User Story:

_**AAU, when viewing the detail page for a movie, I want to see a list of the movie's reviews**_

### Displaying a Movie's Reviews

All that's left is to update **movies/show.ejs** to render the movie's reviews.

The only thing new below is the use of a `if..else` to render differently if there's no reviews yet.

Let's stub up that `if..else` so that we get some practice using EJS:

```html
<!-- views/movies/show.ejs -->

...

</form>

<!-- New markup below -->

<% if (movie.reviews.length) { %>

<% } else { %>

<% } %>
```

There's nothing new between the `if..else`, so let's copy/paste it:

```html
</form>

<!-- New markup below -->

<% if (movie.reviews.length) { %>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Review</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      <% movie.reviews.forEach(function(r) { %>
        <tr>
          <td><%= r.createdAt.toLocaleDateString() %></td>
          <td><%= r.content %></td>
          <td><%= r.rating %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
<% } else { %>
  <h5>No Reviews Yet</h5>
<% } %>
```

Note how we access the reviews array using `movie.reviews`.

### Try Adding Reviews!

Assuming no typos, you should be able to add reviews - congrats!

Let's wrap up with some essential questions before you start on the lab to practice this stuff!

Also, don't forget to check out the<br>_Further Study_ section which shows you how to:

- Retrieve a subdocument embedded in a Mongoose array
- Remove a subdocument from a Mongoose array, and
- Query for a document that contains a certain subdocument!

<details>
<summary>
👀 Do you need to sync your code?
</summary>
<hr>

**`git reset --hard origin/sync-10-finish-embedding`**

<hr>
</details>

## 8. ❓ Essential Questions

<details>
<summary>
(1) True or False: All schemas must be compiled into a Model.
</summary>
<hr>

**False**.  We just used `reviewSchema` for the purpose of embedding reviews, however, we never compiled it into a model.

<hr>
</details>

<details>
<summary>
(2) Is it more efficient to embed or reference related data?
</summary>
<hr>

**Embed** because we can retrieve a document and its related data in a single query.

<hr>
</details>

<details>
<summary>
(3) True or False: An embedded subdocument must have the <code>save()</code> method called on the parent document to be persisted to the database.
</summary>
<hr>

**True**.  True, the top-level/parent document they are embedded within is saved.

<hr>
</details>

## 9. Further Study

#### Retrieve a Subdocument from a Mongoose Array

Mongoose arrays have an `id()` method used to find a subdocument based on the subdoc's `_id`:

```js
const reviewDoc = movieDoc.reviews.id('5c5ce1be03563ad5540e93e2');
```

> Note that the string argument represents the `_id` of the _review_ subdoc, not the _movie_ doc.

#### Remove a Subdocument from a Mongoose Array

Mongoose arrays have a `remove()` method that can be used to remove subdocuments by their `_id`:

```js
movieDoc.reviews.remove('5c5ce1be03563ad5540e93e2');
```

Subdocuments themselves also have a `remove()` method that can be used to remove them from the array:

```js
// remove the first review subdoc
movieDoc.reviews[0].remove();
```

#### Query for a Document that Contains a Certain Subdocument

There's an amazing syntax that you can use to query documents based upon the properties of subdocs.

```js
try {
const movie = await Movie.findOne({'reviews._id': req.params.reviewId}).exec();
// Wow, movie will be the doc that contains the review with an _id
// that equals that of the reviewId route parameter!
} catch (err) {
// Handle any errors that occur during the query
}
```

> Note that the **dot** property syntax must be enclosed in quotes.

For another example, let's say you wanted to find all movies with at least one review with a 5 rating:

```js
try {
const movies = await Movie.find({'reviews.rating': 5}).exec();
console.log(movies); // wow!
} catch (err) {
// Handle any errors that occur during the query
}
```

`reviews.rating` represents the array and a property on the subdocs within that array!

## References

- [MongooseJS Docs - Subdocuments](https://mongoosejs.com/docs/subdocs.html)


