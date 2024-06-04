.PHONY: default

default:
	rsync -c ../eigenmath/doc/help.html .
	rsync -c ../eigenmath/doc/*.pdf manual
	rsync -c ../sassafras/doc/sassafras.pdf .
	make -C examples
