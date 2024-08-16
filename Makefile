.PHONY: default clean

default:
	rsync -c ../eigenmath/doc/help.html .
	rsync -c ../eigenmath/doc/*.pdf manual
	rsync -c ../sassafras/doc/sassafras.pdf sassafras
	rsync -c ../storytime/*.pdf .
	make -C examples

clean:
	rm -f *.aux *.log *.synctex.gz
