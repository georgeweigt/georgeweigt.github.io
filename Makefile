.PHONY: default demos clean collate

%.pdf: %.tex
	pdflatex $<

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	rm -f *.aux *.log *.out *.synctex.gz *.toc

%.html: %.txt
	cat 1 $*.txt 2 > $*.html

demos:
	for file in $$(ls *.txt | sed -e "s/.*Box.*//" -e "s/\.txt/\.html/") ; do make $$file ; done

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.toc tmp tmp.pdf

collate:
	gcc collate.c
	./a.out >tmp
	pdflatex tmp
	rm a.out tmp tmp.pdf
