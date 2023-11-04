.PHONY: default clean

FILES := $(shell ls *.tex | sed "s/combined\.tex//")

# https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html

# Sometimes, must do pdflatex three times to get correct toc

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt
	cat htmlante $< htmlpost > $@

# $$ sends a single $ to the shell

default:
	make combined.tex # in case combined.tex does not exist
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed "s/\.txt/\.html/") ; do make $$file ; done

combined.tex: a.out preamble $(FILES)
	./a.out $(FILES) > combined.tex

a.out: merge.c
	$(CC) merge.c

clean:
	rm -f *.aux *.log *.synctex.gz *.toc
