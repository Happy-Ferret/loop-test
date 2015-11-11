SYSTEM=../system-addons/browser/extensions/loop

cp $SYSTEM/{.eslintignore,.eslintrc,README.txt} .
cp $SYSTEM/{.eslintrc-gecko,bootstrap.js,chrome.manifest,install.rdf} add-on
cp $SYSTEM/{build-jsx,build_extension.sh,jar.mn,manifest.ini,moz.build,run-all-loop-tests.sh} bin

cp -R $SYSTEM/content/modules/ add-on/chrome/modules

rm -Rf add-on/panels/{css,js}
cp -R $SYSTEM/content/panels/ add-on/panels

rm -Rf shared/{css,img,js,sounds,vendor}
cp -R $SYSTEM/content/shared/ shared

rm -Rf skin/{linux,osx,windows}
cp -R $SYSTEM/skin .

cp -R $SYSTEM/test/desktop-local/ add-on/panels/test
cp -R $SYSTEM/test/mochitest/ add-on/chrome/test/mochitest
cp -R $SYSTEM/test/xpcshell/ add-on/chrome/test/xpcshell

cp -R $SYSTEM/ui/ ui
