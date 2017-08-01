
// Load Modules
const fs = require('fs');
const path = require('path');
const request = require('request');
const util = require('util');

// Set default data
const _defaultOcrSpaceUrl = 'https://api.ocr.space/parse/image';
const _base64ImagePattern = 'data:%s;base64,%s';
const _defaultImageType = 'image/gif';
const _defaultLanguade = 'eng';
const _isOverlayRequired = 'false';

/**
 * Run the request to OCR.SPACE and return the result.
 * @example
 * 
 *  Object {options}
 *
 *    { 
 *    apikey: '<YOUR_API_KEY_HERE>',
 *    language: 'por',
 *    isOverlayRequired: true,
 *    url: 'https://api.ocr.space/parse/image' ,
 *    imageFormat: 'image/gif' 
 *    }
* 
 * @param {string} localFile path to local image file
 * @param {string} url url to image
 * @param {object} options object with the options
 * @throws {string} error
 */
var _sendRequestToOcrSpace = function(localFile, url, options) {
  return new Promise(function(resolve, reject) { 
    if (!options.apikey)
      reject("API key required");
    if (localFile && !fs.existsSync(localFile))
      reject("File not found: " + localFile);

    let req = request.post(_defaultOcrSpaceUrl, (error, response, body) => {
      if (error) reject(error);
      else resolve(JSON.parse(body));
    });
    
    let form = req.form();
    form.append('language', options.language || _defaultLanguade);
    form.append('isOverlayRequired', options.isOverlayRequired.toString() || 'false');
    form.append('apikey', options.apikey);
    if (url) 
      form.append('url', url);
    else {
      switch (localFile.split('.').pop()) {
        case 'pdf':
          form.append('file', fs.createReadStream(localFile));
        break;
        case 'png':
        case 'jpg':
        case 'jpeg':
          let bitmap = fs.readFileSync(localFile);
          let stringBase64File = new Buffer(bitmap).toString('base64');
          form.append('Base64Image', util.format(_base64ImagePattern, (options.imageFormat) ? options.imageFormat : _defaultImageType, stringBase64File));
          break;
        default:
          reject('Filetype not supported.');
          break;
      }
    }
  });
}

/**
 * Send a URL image to parse to TEXT with the OCR.SPACE.API
 * @example
 * 
 *  Object {options}
 *
 *    { 
 *    apikey: '<YOUR_API_KEY_HERE>',
 *    language: 'por',
 *    isOverlayRequired: true,
 *    url: 'https://api.ocr.space/parse/image' ,
 *    imageFormat: 'image/gif'
 *    }
* 
 * @param {string} localFile path to local image file
 * @param {object} options object with the options
 * @throws {string} error
 */
exports.parseFromLocalFile = function(localFile, options) {
  return _sendRequestToOcrSpace(localFile, undefined, options);
}

/**
 * Send a URL image to parse to TEXT with the OCR.SPACE.API
 * @example
 * 
 *  Object {options}
 *
 *    { 
 *    apikey: '<YOUR_API_KEY_HERE>',
 *    language: 'por',
 *    isOverlayRequired: true,
 *    url: 'https://api.ocr.space/parse/image'  ,
 *    imageFormat: 'image/gif'
 *    }
* 
 * @param {string} imageUrl url to a image file
 * @param {object} options object with the options
 * @throws {string} error
 */
exports.parseImageFromUrl = function(imageUrl, options) {
  return _sendRequestToOcrSpace(undefined, imageUrl, options);
}

