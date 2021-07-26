.PHONY: default demos clean collate

%.pdf: %.tex
	pdflatex $<

%.html: %.txt
	cat 1 $*.txt 2 > $*.html

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	for file in $$(ls *.txt | sed -e "s/.*Box.*//" -e "s/\.txt/\.html/") ; do make $$file ; done
	make clean

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.toc a.out tmp tmp.pdf

collate:
	gcc collate.c
	./a.out >tmp
	pdflatex tmp
	rm a.out tmp
