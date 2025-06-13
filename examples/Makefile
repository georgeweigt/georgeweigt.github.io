.PHONY: default clean cat

%.pdf: %.tex preamble
	pdflatex $<
	if [ -e $*.toc ] ; then pdflatex $< ; pdflatex $< ; fi

%.html: %.txt text1 text2
	cat text1 $< text2 > $@

default:
	for file in $$(basename -a -s .tex *.tex | sed "s/unified//") ; do make $$file.pdf ; done
	for file in $$(basename -a -s .txt *.txt) ; do make $$file.html ; done

FILES := $(shell ls *.tex | sed "s/unified\.tex//")

unified.tex: unify preamble $(FILES)
	./unify $(FILES) > unified.tex

unify: unify.c
	$(CC) -o unify unify.c

clean:
	rm -f *.aux *.log *.synctex.gz *.toc

demotest: *.txt
	make cat > demotest

# @ for silent

cat:
	@for FILE in *.txt ; do echo "clear\n"; cat $$FILE ; done
