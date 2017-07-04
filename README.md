# ocr-space-api
Allow to access ORC.SPACE api to send images and get the result

More Details: https://ocr.space/ocrapi

**IMPORTANT** The OCR is provided by ocr space.  I don't have anything with them, I just want to help sharing this library.

## Instalation

### First - Register and Get your API key

Get you API key at https://ocr.space/ocrapi ( Direct link : http://eepurl.com/bOLOcf  ). Just, follow their steps.

### Second - Install npm package

```console
  npm install ocr-space-api --save
```

## Usage example

You can see and example at the folder `example`

```javascript
const ocrSpaceApi = require('ocr-space-api');

var options =  { 
    apikey: '<your_api_key_here>',
    language: 'por', // Português
    imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
    isOverlayRequired: true
  };

// Image file to upload
const imageFilePath = "imageFile.jpg";

// Run and wait the result
ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
  .then(function (parsedResult) {
    console.log('parsedText: \n', parsedResult.parsedText);
    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
  }).catch(function (err) {
    console.log('ERROR:', err);
  });

```

### Options

##### Language
  * Portuguese = `por`
  * English = `eng`
  * German = `ger`
  * Italian = `ita`
  * and mode details go to: https://ocr.space/ocrapi#PostParameters

##### isOverlayRequired

`Default = False`
Allows you to specify if the image/pdf text overlay is required. Overlay could be used to show the text over the image


