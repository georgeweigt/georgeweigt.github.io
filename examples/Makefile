.PHONY: default clean

%.pdf: %.tex
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt
	echo '<!DOCTYPE html><html><body><script src="https://georgeweigt.github.io/eigenmath.js"></script><textarea id="stdin" rows="24" cols="80" style="font-family:courier;font-size:1em">' > $@
	cat $< >> $@
	echo '</textarea> <button onclick="run()">Run</button><br><div id="stdout"></div></body></html>' >> $@

default:
	for file in $$(basename -a -s .tex *.tex) ; do make $$file.pdf ; done
	for file in $$(basename -a -s .txt *.txt) ; do make $$file.html ; done

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.toc
