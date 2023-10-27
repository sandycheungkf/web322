/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kwai Fong Cheung Student ID: 111951224 Date: Oct 27 2023
*
* Published URL: ___________________________________________________________
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static('public'));

legoData.Initialize()
    .then(() => {
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'home.html'));
        });

        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        app.get('/lego/sets', (req, res) => {
            const theme = req.query.theme;
            if (theme) {
                legoData.getSetsByTheme(theme)
                    .then((sets) => res.json(sets))
                    .catch((error) => {
                        res.status(404).send(error);
                    });
            } else {
                legoData.getAllSets()
                    .then((sets) => res.json(sets))
                    .catch((error) => {
                        res.status(404).send(error);
                    });
            }
        });

        app.get('/lego/sets/:id', (req, res) => {
            const setId = req.params.id;
            legoData.getSetByNum(setId)
                .then((set) => {
                    if (set) {
                        res.json(set);
                    } else {
                        res.status(404).send('Lego set not found');
                    }
                })
                .catch((error) => {
                    res.status(404).send(error);
                });
        });

        app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        });

        app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));
    })
    .catch((error) => {
        console.error('Error during initialization', error);
    });
