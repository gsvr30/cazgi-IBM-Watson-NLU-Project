const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingv1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingv1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

function getEmotion(nluParams, res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(nluParams)
        .then(emotionResults => {
            res.send(emotionResults.result.emotion.document.emotion);
        }).catch(err => {
            res.send(err.toString());
        });

}

function getSentiment(nluParams, res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(nluParams)
        .then(emotionResults => {
            res.send(emotionResults.result.sentiment.document);
        }).catch(err => {
            res.send(err.toString());
        });

}

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let urlEmotion = req.query.url;
    const nluParams = {
        'url': urlEmotion,
        'features': {
            'emotion': {}
        }
    };
    getEmotion(nluParams, res);
});

app.get("/url/sentiment", (req,res) => {
    let urlSentiment = req.query.url;
    const nluParams = {
        'url': urlSentiment,
        'features': {
            'sentiment': {}
        }
    };
    getSentiment(nluParams, res);
});

app.get("/text/emotion", (req,res) => {
    let textToFindEmotion = req.query.text;
    const nluParams = {
        'text': textToFindEmotion,
        'features': {
            'emotion': {}
        }
    };
    getEmotion(nluParams, res);
});

app.get("/text/sentiment", (req,res) => {
    let textSentiment = req.query.text;
    const nluParams = {
        'text': textSentiment,
        'features': {
            'sentiment': {}
        }
    };
    getSentiment(nluParams, res);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

