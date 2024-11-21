.PHONY: default clean

%.pdf: %.tex preamble
	pdflatex $<

%.html: %.txt htmlante htmlpost
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	for file in $$(basename -a -s .tex *.tex) ; do make $$file.pdf ; done
	for file in $$(basename -a -s .txt *.txt) ; do make $$file.html ; done

clean:
	rm -f *.aux *.log *.synctex.gz *.toc
