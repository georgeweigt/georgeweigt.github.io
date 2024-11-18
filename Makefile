.PHONY: default clean

default:
	rsync -c ../eigenmath/js/eigenmath.js .
	rsync -c ../eigenmath/doc/help.html .
	rsync -c ../eigenmath/doc/*.pdf manual
	rsync -c ../eigenmath/doc/eigenmath.pdf .
	rsync -c ../sassafras/doc/sassafras.pdf .
	rsync -c ../storytime/*.pdf .
	make -C examples

clean:
	rm -f *.aux *.log *.synctex.gz
