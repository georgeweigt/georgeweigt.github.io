.PHONY: default clean

%.pdf: %.tex preamble
	pdflatex $<

%.html: %.txt ../text1 ../text2
	cat ../text1 $< ../text2 > $@

default:
	for FILE in $$(basename -a -s .tex *.tex) ; do make $$FILE.pdf ; done
	for FILE in $$(basename -a -s .txt *.txt) ; do make $$FILE.html ; done

clean:
	rm -f *.aux *.log *.synctex.gz
