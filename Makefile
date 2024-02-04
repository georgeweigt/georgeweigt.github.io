.PHONY: default

default:
	rsync ../eigenmath/doc/help.html .
	rsync ../eigenmath/doc/*.pdf manual
