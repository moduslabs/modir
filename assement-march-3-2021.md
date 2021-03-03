# Modus Directory App

https://dir.modus.app

## Notes:

* In firefox, it asks me to login every reload.

* Not sure why it's including the google closure library.  I used it in the distant past, but I am pretty sure it's
long been deprecated.  Along with gapi, it's about 100K.

* Some of this google code that is used is copyright 2012.

* loading of employee data/list is very slow.  On the order of 15 seconds.

* The dir.modus.app server is slow serving static files.  page-modite-detail.def3f05c.chunk.css takes over 200 ms to
load.

* a number of avatar images fetched return 403.

* clicking on a employee (the first one, Daniel Abayomi) creates a white page.  There is no .map file for the JS so
the best I can do is 
TypeError: Cannot read property 'Location' of null
    at t.default (index.tsx:37)
    at Xl (react-dom.production.min.js:3274)
    at Ci (react-dom.production.min.js:3745)
    at Mi (react-dom.production.min.js:3935)
    at $a (react-dom.production.min.js:5514)
    at Qa (react-dom.production.min.js:5536)
    at Oo (react-dom.production.min.js:5958)
    at Po (react-dom.production.min.js:5925)
    at To (react-dom.production.min.js:5860)
    at react-dom.production.min.js:5761
overrideMethod @ react_devtools_backend.js:2430
fa @ react-dom.production.min.js:4408
n.callback @ react-dom.production.min.js:4773
ra @ react-dom.production.min.js:4271
na @ react-dom.production.min.js:4259
Wa @ react-dom.production.min.js:4999
Ba @ react-dom.production.min.js:5123
(anonymous) @ react-dom.production.min.js:5975
t.unstable_runWithPriority @ scheduler.production.min.js:274
Ro @ react-dom.production.min.js:5974
Oo @ react-dom.production.min.js:5958
Po @ react-dom.production.min.js:5925
To @ react-dom.production.min.js:5860
(anonymous) @ react-dom.production.min.js:5761
Promise.then (async)
(anonymous) @ react-dom.production.min.js:4747
ga @ react-dom.production.min.js:4745
Aa @ react-dom.production.min.js:4910
Ba @ react-dom.production.min.js:5104
(anonymous) @ react-dom.production.min.js:5975
t.unstable_runWithPriority @ scheduler.production.min.js:274
Ro @ react-dom.production.min.js:5974
Oo @ react-dom.production.min.js:5958
Po @ react-dom.production.min.js:5925
Uo @ react-dom.production.min.js:6020
Cn @ react-dom.production.min.js:1737
index.tsx:37 Uncaught (in promise) TypeError: Cannot read property 'Location' of null
    at t.default (index.tsx:37)
    at Xl (react-dom.production.min.js:3274)
    at Ci (react-dom.production.min.js:3745)
    at Mi (react-dom.production.min.js:3935)
    at $a (react-dom.production.min.js:5514)
    at Qa (react-dom.production.min.js:5536)
    at Oo (react-dom.production.min.js:5958)
    at Po (react-dom.production.min.js:5925)
    at To (react-dom.production.min.js:5860)
    at react-dom.production.min.js:5761

## Recommendations

* Discover the cause of slow server at dir.modus.app.
* Fix firefox bug
* speed up loading of employee data list
* fix the Location property bug
* Discover the 403 issue cause
* Discover the use of closure library (what's loading it)









