Changelog
=========

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## v3.32.0 (2021-02-05)

#### :bug: Bug Fix

* Fixed parsing of JSON structures `engines/fetch`

## v3.30.0 (2021-01-10)

#### :bug: Bug Fix

* Fixed providing of empty strings as API url-s

## v3.29.1 (2020-12-23)

#### :bug: Bug Fix

* Added response status checking whether it's 204 before decoding a server response `Response`

## v3.28.0 (2020-11-06)

#### :rocket: New Feature

* Added new engine based on Fetch API
* Added decoding text in `Response` into `Document`
* Added decoding `Buffer` (in Node.js) and `ArrayBuffer` in `Response` into json
* Supported response type `"blob"` in Node.js request engine
* Use `"arraybuffer"` (in `XmlHtpRequest` engine ) and `"buffer"` (in Node.js engine) as default `responseType`
* Use Fetch API by default in browser if `AbortController` is supported

#### :house: Internal

* Run tests with all engines instead of only Node.js one
* Test aborting the request on timeout
* Improved stability of tests by using local server instead of remote mock service

## v3.27.1 (2020-09-10)

#### :bug: Bug Fix

* Fixed a bug with iOS and ES6 when the engine hasn't parsed a declaration with nested arrow functions

## v3.26.0 (2020-09-04)

#### :rocket: New Feature

* Added `jsonReviver` to `CreateRequestOptions`

## v3.20.0 (2020-07-05)

#### :rocket: New Feature

* Added tests
* Added node.js support
* Added `cache` to `RequestResponseObject`

#### :bug: Bug Fix

* Fixed bugs
