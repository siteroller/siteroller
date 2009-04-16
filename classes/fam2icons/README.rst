=====================
 OTRS Theme FamFamFam
=====================

This is a theme for the free ticketsystem OTRS_, by `Puzzle ITC`_. It uses icons
of FamFamFam_ and was inspired by the default layout of Redmine_.

It introduces some Javascript enhancements to make the overview of
tickets collapsed.

The theme is released under GPL_ Version 3 (See COPYING for more infos),
FamFamFam icons are licensed under a `Creative Commons Attribution 2.5 License`_
for further information have a look at `FamFamFam About`-Page.

Authors:

* Simon Josi <josi+famfamfam(at)puzzle.ch>
* Marcel Haerry <haerry+famfamfam(at)puzzle.ch>

Installation
------------

This theme contains the following 4 folders:

* css
* images
* js
* html

You have to copy them to the following locations:

html: ::

  mkdir -p <your otrs installation>/Kernel/Output/HTML
  cp -a html <your otrs installation>/Kernel/Output/HTML/FamFamFam

css: ::

  mkdir -p <your otrs installation>/var/httpd/htdocs/css
  cp -a css  <your otrs installation>/var/httpd/htdocs/css/FamFamFam

images: ::

  mkdir -p <your otrs installation>/var/httpd/htdocs/images
  cp -a images <your otrs installation>/var/httpd/htdocs/images/FamFamFam

js: ::

  mkdir -p <your otrs installation>/var/httpd/htdocs/js
  cp -a js <your otrs installation>/var/httpd/htdocs/js/FamFamFam

Additionally you have to register your theme in the otrs database. For MySQL
this can look like:
::

  mysql otrs
  mysql> INSERT INTO theme
    ->     (theme, valid_id, create_time, create_by, change_time, change_by)
    ->     VALUES
    ->     ('FamFamFam', 1, current_timestamp, 1, current_timestamp, 1);
  mysql>

Now the new theme should be useable in OTRS. It should be possible to select
it via your personal preferences page. For further information about a custom
them have a look at the `OTRS Help`_.

.. _OTRS: http://www.otrs.org
.. _FamFamFam: http://www.famfamfam.com
.. _FamFamFam About: http://www.famfamfam.com/about
.. _Redmine: http://www.redmine.org 
.. _GPL: http://www.gnu.org/copyleft/gpl.html
.. _Puzzle ITC: http://www.puzzle.ch
.. _OTRS Help: http://doc.otrs.org/2.3/en/html/c1850.html
.. _Creative Commons Attribution 2.5 License: http://creativecommons.org/licenses/by/2.5
