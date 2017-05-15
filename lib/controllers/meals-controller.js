const Food = require('../models/food')
const Meal = require('../models/meal')
const MealFood = require('../models/meal_food')

function index (request, response) {
  Meal.all()
  .then((data) => {
    let meals = data.rows
    if (!meals) {
      return response.sendStatus(404)
    } else {
      return response.json(meals)
    }
  })
}

function show (request, response) {
  Meal.find(request.params.id)
  .then((data) => {
    let meal = data.rows[0]
    if (!meal) {
      return response.sendStatus(404)
    } else {
      return response.json(meal)
    }
  })
}

module.exports = {
  index: index,
  show: show
}
