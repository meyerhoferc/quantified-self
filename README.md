## Quantified Self API

Quantified Self is a Node.js / Express API that provides CRUD functionality for foods and meals for the [Quantified Self Client](https://meyerhoferc.github.io/quantified-self-client).

### Setup
Clone this repo.

`npm install`

### Running the tests
`knex migrate:latest`

`npm test`

Base Url: https://quantified-self-cm.herokuapp.com/
### Resources Available
#### Meals
Creating a meal

```
url: POST /api/v1/meals/

body: {foods: [food_id, food_id, food_id], meal: nameOfMeal, totalCalories: number, dailyLog: date}
```

Reading a meal

`url: GET /api/v1/meals/:id`


Updating a meal

```
url: PUT /api/meals/:id

body: {foods: [food_1, food_2, etc.], meal: nameOfMeal, totalCalories: number, dailyLogId: id}
```

Deleting a meal

`url: DELETE /api/v1/meals/:id`

#### Foods

Get all Foods

`url: GET /api/foods`

Get a Food

`url: GET /api/foods/:id`

Create a Food

```
url: POST /api/foods

body: {name: nameOfFood, calories: numberCals}
```
Update a Food

```
url: PUT /api/foods/:id

body: {name: nameOfFood, calories: numberCals}
```
Delete a Food

`url: DELETE /api/foods/:id`

Search Foods

`url: GET /api/search/foods?name=nameOfFood`
