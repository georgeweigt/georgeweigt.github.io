.PHONY: default

%.pdf: %.tex
	pdflatex $<

%.html: %.txt
	echo "<html><body style='background-color:#f2f2f2'><script src='https://georgeweigt.github.io/eigenmath.js'></script><textarea id='stdin' rows='24' cols='80' style='font-family:courier;font-size:12pt'>" > $*.html
	cat $*.txt >> $*.html
	echo "</textarea><button onclick='run()'>Run</button><p><div id='stdout'></div></body></html>" >> $*.html

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed -e "s/.*Box.*//" -e "s/\.txt/\.html/") ; do make $$file ; done
