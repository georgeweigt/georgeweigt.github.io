.PHONY: default clean

TEXFILES := $(shell ls *.tex | sed "s/unified\.tex//")

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

# Sometimes, must do pdflatex three times to get correct toc

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	make unified.tex
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed "s/\.txt/\.html/") ; do make $$file ; done

unified.tex: a.out preamble $(TEXFILES)
	./a.out $(TEXFILES) > unified.tex

a.out: unify.c
	$(CC) unify.c

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.toc
