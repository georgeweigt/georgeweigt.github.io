# make unified.pdf

.PHONY: default clean

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt htmlante htmlpost
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	for file in $$(basename -a -s .tex *.tex | sed "s/unified//") ; do make $$file.pdf ; done
	for file in $$(basename -a -s .txt *.txt) ; do make $$file.html ; done

clean:
	rm -f *.aux *.log *.synctex.gz *.toc

SRC := $(shell ls *.tex | sed "s/unified\.tex//")

unified.tex: unify preamble $(SRC)
	./unify $(SRC) > unified.tex

unify: unify.c
	$(CC) -o unify unify.c
