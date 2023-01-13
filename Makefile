.PHONY: default clean

%.pdf: %.tex
	pdflatex $<

%.html: %.txt
	cat html-intro $< html-outro > $@

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed -e "s/.*Box.*//" -e "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.synctex.gz
