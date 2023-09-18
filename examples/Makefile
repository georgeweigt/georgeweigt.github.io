.PHONY: default clean

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

%.pdf: %.tex
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; fi

%.html: %.txt
	cat html-ante $< html-post > $@

# $$ sends a single $ to the shell

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.synctex.gz *.toc
