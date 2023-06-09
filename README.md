# Minesweeper

[![semantic-release: Conventional](https://img.shields.io/badge/semantic--release-conventional-fa6673?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Best Practices

This project is my testbed for improving my code workflow to comply with best practices.

Code Formatting

- [x] Code formatting with prettier
- [x] Code formatting performed automatically by editor
- [x] Pre-commit hook for code formatting
- [x] CI check during pull request for code formatting

Code Linting

- [x] Code linting with eslint
- [x] Code linting performed automatically by editor
- [x] Pre-commit hook for code linting
- [x] CI check during pull request for code linting

Testing

- [x] Testing with Vitest and React Testing Library
- [x] Pre-commit hook for tests
- [x] CI check for tests
- [ ] Pre-commit hook for test coverage
- [ ] CI check for test coverage

Git Best Practices

- [x] Don't commit directly to master and enforce by pre-commit hook
- [x] Conventional Commits optionally generated with commitizen
- [x] Conventional Commits enforced by pre-commit hook
- [x] Conventional Commits enforced by CI check

Versioning and Build

- [x] Semantic Versioning as part of the CI/CD pipeline with semantic-release
- [x] Build new docker image on each release

## Minesweeper Features

- [x] Establish a react front-end minesweeper game board with in-memory game data.
- [x] Establish basic game logic that enforces the above game rules on a 10x10 board.
- [x] Each cell is an object that stores pertinent information for that cell (ie. wasClicked, isBomb, adjacentBombCount...)
- [x] One way to store these values to keep track of position is an adjacency matrix .
- [x] One could also have a property pointing to adjacent cells directly on the cell object.
- [x] Add the ability to change the difficulty (size of the board and quantity of mines).
- [ ] Add a timer to the game.
- [ ] View a list of recently played user times and difficulty setting.
- [ ] Define a RESTful API that connects to a postgres database.
- [ ] Create a login page that takes in a username (no authentication required).
- [ ] Database should store each user, their top time, and the game's difficulty setting.
- [ ] Refactor the frontend to persist and retrieve data to the API.
- [ ] Establish the ability to undo and redo moves
- [ ] Establish game logic that increases the duration of the game by 10 seconds for each time the undo/redo feature is used.
- [ ] Create a user page that shows all times and difficulties for a given user.
- [ ] Establish the ability to close the browser and reload the previously played game.
- [ ] Establish the ability to click on a previously completed game and click through the moves that were made.
- [x] Deploy.

## How to Run

Deploy app with docker compose.

`docker-compose.yml`

```
version: '3.8'
services:
  minesweeper:
    container_name: minesweeper
    hostname: minesweeper
    image: jacobtheeldest/minesweeper:latest
    restart: unless-stopped
    ports:
      - "80:80"

```
