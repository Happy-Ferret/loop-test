#!/bin/sh

cd built/add-on
if [ -f loop\@test.mozilla.org.xpi ]; then
  rm loop\@test.mozilla.org.xpi
fi

zip -r loop\@test.mozilla.org.xpi .
