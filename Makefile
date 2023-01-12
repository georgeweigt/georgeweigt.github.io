.PHONY: default clean

%.pdf: %.tex
	pdflatex $<

%.html: %.txt
	echo "<html><head><link rel='stylesheet' href='style.css'></head><body><script src='https://georgeweigt.github.io/eigenmath.js'></script><textarea id='stdin'>" > $*.html
	cat $*.txt >> $*.html
	echo "</textarea><button onclick='run()'>Run</button><br><div id='stdout'></div></body></html>" >> $*.html

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed -e "s/.*Box.*//" -e "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.synctex.gz
