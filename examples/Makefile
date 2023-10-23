.PHONY: default clean

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

# Sometimes, must do pdflatex three times to get correct toc

%.pdf: %.tex
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt
	cat html-ante $< html-post > $@

# $$ sends a single $ to the shell

default:
	make combined.tex
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.synctex.gz *.toc

combined.tex: cat-latex *.tex
	rm -f combined.tex
	./cat-latex *.tex > combined
	mv combined combined.tex

cat-latex: cat-latex.c
	gcc -o cat-latex cat-latex.c
