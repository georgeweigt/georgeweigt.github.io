.PHONY: default

default:
	rsync -c ../eigenmath/js/eigenmath.js .
	rsync -c ../eigenmath/doc/help.html .
	rsync -c ../eigenmath/doc/*.pdf manual
	rsync -c ../eigenmath/doc/eigenmath.pdf .
	rsync -c ../sassafras/doc/sassafras.pdf .
	make -C examples
