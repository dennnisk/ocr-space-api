
// Load Modules
const fs = require('fs');
const request = require('request');
const util = require('util');
//const Q = require('q');


// Set default data
const _defaultOcrSpaceUrl = 'https://api.ocr.space/parse/image';
const _base64ImagePattern = 'data:%s;base64,%s';
const _defaultImageType = 'image/gif';
const _defaultLanguade = 'por';
const _isOverlayRequired = false;


/**
 * Run the request to OCR.SPACE and return the result.
 * @example
 * 
 *  Object {options}
 *
 *      { 
 *        apikey: '<YOUR_API_KEY_HERE>',
 *        language: 'por',
 *        isOverlayRequired: true,
 *        url: 'https://api.ocr.space/parse/image' ,
 *        imageFormat: 'image/gif' 
 *      }
* 
 * @param {string} localFile path to local image file
 * @param {string} url url to image
 * @param {object} options object with the options
 * @throws {string} error
 */
var _sendRequestToOcrSpace = function(localFile, url, options) {
    return new Promise(function(resolve, reject) { 
        try {
            
            if (!options || !options.apikey) {
                deferred.reject("API key required");
            }

            // Initialize options, to avoid errors.
            if (!options) {
                options = {};
            }

            const formOptions = {
                    language: options.language ? options.language : _defaultLanguade,
                    apikey: options.apikey,
                    isOverlayRequired: options.isOverlayRequired ? options.isOverlayRequired : false
                };
                
            // make string base64 from a local file
            if (localFile) {

                if (!fs.existsSync(localFile)) {
                    deferred.reject("File not exists: " + localFile);
                }

                var bitmap = fs.readFileSync(localFile);
                var stringBase64File = new Buffer(bitmap).toString('base64');
                formOptions.Base64Image = util.format(_base64ImagePattern, (options.imageFormat) ? options.imageFormat : _defaultImageType, stringBase64File);

            } else if (url) {
                formOptions.url = url;
            } else {
                deferred.reject("URL image or File image is required.");
            }

            const uri = {
                method: 'post',
                url: options.url ? options.url : _defaultOcrSpaceUrl, 
                form: formOptions,
                headers: {  
                    "content-type": "application/json",
                },
                json: true,
            };

            request(uri, function (error, response, ocrParsedResult) {  
                if (error) {
                    deferred.reject(error);
                } else {

                    //Get the parsed results, exit code and error message and details
                    var parsedResults = ocrParsedResult["ParsedResults"];
                    //var ocrExitCode = ocrParsedResult["OCRExitCode"];
                    //var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
                    //var errorMessage = ocrParsedResult["ErrorMessage"];
                    //var errorDetails = ocrParsedResult["ErrorDetails"];
                    //var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];

                    if (parsedResults) {
                        var pageText = '';

                        parsedResults.forEach(function(value) {
                            var exitCode = value["FileParseExitCode"];
                            var parsedText = value["ParsedText"];
                            //var errorMessage = responseBody["ParsedTextFileName"];
                            //var errorDetails = responseBody["ErrorDetails"];

                            //var textOverlay = responseBody["TextOverlay"];
                            
                            switch (+exitCode) {
                                case 1:
                                    pageText = parsedText;
                                    break;
                                case 0:
                                case -10:
                                case -20:
                                case -30:
                                case -99:
                                default:
                                    pageText += "Error: " + errorMessage;
                                    break;
                            }
                            
                        }, this);

                        // Monta o objeto com os resultados
                        const result = {
                            parsedText: pageText,
                            ocrParsedResult: ocrParsedResult
                        }

                        resolve(result);
                    } else {
                        reject(ocrParsedResult);
                    }
                }
            });             
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Send a URL image to parse to TEXT with the OCR.SPACE.API
 * @example
 * 
 *  Object {options}
 *
 *      { 
 *        apikey: '<YOUR_API_KEY_HERE>',
 *        language: 'por',
 *        isOverlayRequired: true,
 *        url: 'https://api.ocr.space/parse/image' ,
 *        imageFormat: 'image/gif'
 *      }
* 
 * @param {string} localFile path to local image file
 * @param {object} options object with the options
 * @throws {string} error
 */
exports.parseImageFromLocalFile = function(localFile, options) {
    return _sendRequestToOcrSpace(localFile, undefined, options);
}

/**
 * Send a URL image to parse to TEXT with the OCR.SPACE.API
 * @example
 * 
 *  Object {options}
 *
 *      { 
 *        apikey: '<YOUR_API_KEY_HERE>',
 *        language: 'por',
 *        isOverlayRequired: true,
 *        url: 'https://api.ocr.space/parse/image'  ,
 *        imageFormat: 'image/gif'
 *      }
* 
 * @param {string} imageUrl url to a image file
 * @param {object} options object with the options
 * @throws {string} error
 */
exports.parseImageFromUrl = function(imageUrl, options) {
    return _sendRequestToOcrSpace(undefined, imageUrl, options);
}

