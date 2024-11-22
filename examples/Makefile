# make unified.pdf

.PHONY: default clean

TEX := $(shell basename -a -s .tex *.tex | sed "s/unified//")
TXT := $(shell basename -a -s .txt *.txt)

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt htmlante htmlpost
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	for file in $(TEX) ; do make $$file.pdf ; done
	for file in $(TXT) ; do make $$file.html ; done

clean:
	rm -f *.aux *.log *.synctex.gz *.toc

SRC := $(shell ls *.tex | sed "s/unified\.tex//")

unified.tex: unify preamble $(SRC)
	./unify $(SRC) > unified.tex

unify: unify.c
	$(CC) -o unify unify.c
