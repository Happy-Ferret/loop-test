git filter-branch -f --tree-filter "\
if [ -f .eslintrc-gecko ];         then mkdir -p add-on;             mv .eslintrc-gecko add-on;                fi; \
if [ -f build-jsx ];               then mkdir -p bin;                mv build-jsx bin;                         fi; \
if [ -f jar.mn ];                  then mkdir -p bin;                mv jar.mn bin;                            fi; \
if [ -f manifest.ini ];            then mkdir -p bin;                mv manifest.ini bin;                      fi; \
if [ -f moz.build ];               then mkdir -p bin;                mv moz.build bin;                         fi; \
if [ -f run-all-loop-tests.sh ];   then mkdir -p bin;                mv run-all-loop-tests.sh bin;             fi; \
if [ -f standalone/Makefile ];     then                              mv standalone/Makefile .;                 fi; \
if [ -f standalone/package.json ]; then                              mv standalone/package.json .;             fi; \
if [ -f standalone/server.js ];    then mkdir -p bin;                mv standalone/server.js bin;              fi; \
if [ -d content/libs ];            then                              mv content/{libs,vendor};                 fi; \
if [ -d content/shared/img/svg ];  then                              mv content/shared/img/{svg/*,.};          fi; \
if [ -d content/shared/libs ];     then                              mv content/shared/{libs,vendor};          fi; \
if [ -d content/shared ];          then                              mv content/shared .;                      fi; \
if [ -d content ];                 then mkdir -p add-on;             mv content add-on/panels;                 fi; \
if [ -d modules ];                 then mkdir -p add-on/chrome;      mv modules add-on/chrome;                 fi; \
if [ -d standalone/content/libs ]; then                              mv standalone/content/{libs,vendor};      fi; \
if [ -d test/desktop-local ];      then mkdir -p add-on/panels;      mv test/desktop-local add-on/panels/test; fi; \
if [ -d test/mochitest ];          then mkdir -p add-on/chrome/test; mv test/mochitest add-on/chrome/test;     fi; \
if [ -d test/shared ];             then mkdir -p shared;             mv test/shared shared/test;               fi; \
if [ -d test/standalone ];         then mkdir -p standalone;         mv test/standalone standalone/test;       fi; \
if [ -d test/xpcshell ];           then mkdir -p add-on/chrome/test; mv test/xpcshell add-on/chrome/test;      fi; \
"
