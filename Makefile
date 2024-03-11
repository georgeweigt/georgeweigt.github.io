.PHONY: default

default:
	rsync -t ../eigenmath/doc/help.html .
	rsync -t ../eigenmath/doc/*.pdf manual
	make -C examples
