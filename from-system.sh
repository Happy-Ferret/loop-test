SYSTEM=../gecko-dev/browser/extensions/loop

cp $SYSTEM/{.eslintignore,.eslintrc,README.txt} .
cp $SYSTEM/{.eslintrc-gecko,bootstrap.js,install.rdf.in} add-on
cp $SYSTEM/{build-jsx,jar.mn,manifest.ini,moz.build,run-all-loop-tests.sh} bin

cp -R $SYSTEM/content/modules/ add-on/chrome/modules

rm -Rf add-on/panels/{css,js}
cp -R $SYSTEM/content/panels/ add-on/panels

cp -R $SYSTEM/content/preferences/ add-on/preferences

rm -Rf shared/{css,img,js,sounds,vendor}
cp -R $SYSTEM/content/shared/ shared

rm -Rf skin/{linux,osx,windows}
cp -R $SYSTEM/skin .

cp -R $SYSTEM/standalone/content/ standalone/content

cp -R $SYSTEM/test/desktop-local/ add-on/panels/test
cp -R $SYSTEM/test/mochitest/ add-on/chrome/test/mochitest
cp -R $SYSTEM/test/xpcshell/ add-on/chrome/test/xpcshell
cp -R $SYSTEM/test/shared/ shared/test
cp -R $SYSTEM/test/standalone/ standalone/test

cp -R $SYSTEM/ui/ ui

# this assumes that in the system-addons tree, an up-to-date build has been
# done before running this script, so that a chrome.manifest generated
# from the current jar.mn can be copied into this repo.  
#
# XXX we need to write a python script that uses mozbuild
# (presumably from PyPI) to do this generation directly
FEATURE=../gecko-dev/obj*/dist/bin/browser/features/loop@mozilla.org
cp $FEATURE/chrome.manifest add-on/
