DROP TABLE IF EXISTS users, activities, routines, routine_activities; 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE routines (
    id SERIAL PRIMARY KEY,
    "creatorId" INTEGER FOREIGN KEY,
    "isPublic" BOOLEAN DEFAULT false,
    name VARCHAR(255) UNIQUE NOT NULL,
    goal TEXT NOT NULL
)

CREATE TABLE routine_activities (
    id SERIAL PRIMARY KEY,
    "routineId" INTEGER FOREIGN KEY,
    "activityId" INTEGER FOREIGN KEY,
    duration INTEGER,
    count INTEGER,
)

