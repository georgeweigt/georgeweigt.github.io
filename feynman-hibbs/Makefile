.PHONY: default clean

# $* The stem with which an implicit rule matches

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

%.pdf: %.tex
	pdflatex $*
	rm $*.aux $*.log

%.html: %.txt
	echo "<html><body><script src='https://georgeweigt.github.io/eigenmath.js'></script><textarea id='stdin' rows='24' cols='80' style='font-family:courier;font-size:12pt'>" > $*.html
	cat $*.txt >> $*.html
	echo "</textarea><p><button onclick='run()'>Run</button><p><div id='stdout'></div></body></html>" >> $*.html

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.synctex.gz
