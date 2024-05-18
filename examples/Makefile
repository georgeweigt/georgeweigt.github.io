# make
# make unified.pdf

.PHONY: default clean

TEXFILES := $(shell ls *.tex | sed "s/unified\.tex//")
PDFFILES := $(shell sed "s/\.tex/\.pdf/g" <<< "$(TEXFILES)") # here-string
HTMFILES := $(shell ls *.txt | sed "s/\.txt/\.html/")

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

# Sometimes, must do pdflatex three times to get correct toc

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt htmlante htmlpost
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	for file in $(PDFFILES) ; do make $$file ; done
	for file in $(HTMFILES) ; do make $$file ; done

unified.tex: unify preamble $(TEXFILES)
	./unify $(TEXFILES) > unified.tex

unify: unify.c
	$(CC) -o unify unify.c

clean:
	rm -f *.aux *.log *.synctex.gz *.toc
