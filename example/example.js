
const ocrSpaceApi = require('./../lib/ocrSpaceApi');

var options =  { 
    apikey: '<your_api_key_here>',
    language: 'por',
    imageFormat: 'image/png',
    isOverlayRequired: true
  };

const imageFilePath = __dirname + "\\lovetext.jpg";

ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
  .then(function (parsedResult) {
    console.log('---------- parsedText: \n', 
      parsedResult.parsedText,
      '\n -------- ocrParsedResult: \n', 
      parsedResult.ocrParsedResult);
  }).catch(function (err, body) {
    console.log('ERROR:', err, body);
  });


