'use strict';

const express = require(`express`);
const router = express.Router();

const printString = (string) => (req, res) => res.send(`route: ${string}`);
const routes = [`/`, `/register`, `/login`, `/my`, `/my/comments`, `/offers/category/:id`, `/offers/add`, `/search`, `/offers/edit/:id`, `/offers/:id`];

routes.forEach((route) => router.get(route, printString(route)));

module.exports = router;
