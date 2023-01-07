cannoness
=========

phaser cannon blasting platformer


Controls
--------

* W - point cannon up
* A - move/point cannon left
* S - point cannon down
* D - move/point cannon right
* SPACE - jump
* SHIFT - fire


How to Run
----------

cannoness runs in web browsers and needs to be hosted by a webserver.  To host it, start up a webserver that gives access to the index.html file within the cannoness top-level directory.  For example, if you have python (>=3) installed, navigate to the cannoness directory and run

```
> python -m http.server 8000
```

This will start a server exposing that directory on port 8000.  You can then access the program by pointing your web browser to the URL `http://localhost:8000`.


Dependencies
------------

Dependencies are included.

* phaser
