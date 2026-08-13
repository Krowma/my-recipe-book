# my-recipe-book

**A cooking app for storing recipes on your phone.**

# About the Project
My Recipe Book is a mobile app that let the user store, consult and exchange cooking recipes. The app is fully offline so it can be accessed at anytime.\
The goal of this project is to practice my JavaScript, React and SQL skills. As such it is developed using the [Expo framework](https://expo.dev/) and a [SQLite database](https://docs.expo.dev/versions/latest/sdk/sqlite/).

# Technologies
**Frameworks**  
![React Native](https://img.shields.io/badge/React%20Native-grey?logo=react) 
![Expo](https://img.shields.io/badge/Expo-%231C2024?logo=expo)

**Database**  
![SQLite](https://img.shields.io/badge/SQLite-%23003B57?logo=sqlite)

**Language**  
![TypeScript](https://img.shields.io/badge/TypeScript-grey?logo=typescript)

# Content
## Recipe Book
The landing screen of the app, it presents the recipes in the database to the user in a scrollable list, by tapping one of the recipes the user can open its details screen. Only the recipes useful information (name, image, tags) are fetched from the database, the details (ingredients, instructions, …) are stored in separate tables.

### Filter Recipes
To make it easier to choose a recipe, a search bar let the user filter the list of recipes using tags, only the recipes containing the entered tags will be fetched from the database. The user can also filter the list to only show the recipes marked as favorites.

## Recipe Details
This screen let the user see the details of a recipe like the required ingredients (scalable with a slider representing the number of servings), the instructions or the notes added by the user. Those details are only fetched from the database when opening the Recipe Details screen to avoid cluttering the phone memory with unnecessary data.

### Cooking Timers
When a cooking instruction has a timer, it can be directly triggered from the instruction itself. If the user as granted the notification authorization to the app, they will receive a notification on their phone when the timer ends, even if the app is closed.

## Add and Edit a Recipe
An edition screen using React Hook Form, let the user add a new recipe to the database or edit an existing one. It is also possible to export and import recipes as json to share them with others.

## Database
The app uses a local SQLite database, it is composed of several tables to make it easier to only fetch the required data when it is needed without cluttering the phone memory.

# Set-up

# Releases
[**v1.0.0**](https://github.com/Krowma/my-recipe-book/releases/tag/v1.0.0) - MVP (Recipe book and Recipe details screens, SQL database, Cooking timers).
