.PHONY: default clean demos

%.pdf: %.tex
	pdflatex $<

# $$ sends a single $ to the shell
# sed changes .tex to .pdf

default:
	for file in $$(ls *.tex | sed "s/\.tex/\.pdf/") ; do make $$file ; done
	rm -f *.aux *.log *.out *.synctex.gz *.toc

clean:
	rm -f *.aux *.log *.out *.synctex.gz *.toc

demos:
	cat 1.txt angmomop.txt 2.txt > angmomop.html
	cat 1.txt anticomm.txt 2.txt > anticomm.html
	cat 1.txt bhabha-scattering-1.txt 2.txt > bhabha-scattering-1.html
	cat 1.txt bhabha-scattering-2.txt 2.txt > bhabha-scattering-2.html
	cat 1.txt bhabha-scattering-3.txt 2.txt > bhabha-scattering-3.html
	cat 1.txt bhabha-scattering-4.txt 2.txt > bhabha-scattering-4.html
	cat 1.txt bhabha-scattering-5.txt 2.txt > bhabha-scattering-5.html
	cat 1.txt bohrradius.txt 2.txt > bohrradius.html
	cat 1.txt compton-scattering-1.txt 2.txt > compton-scattering-1.html
	cat 1.txt compton-scattering-2.txt 2.txt > compton-scattering-2.html
	cat 1.txt compton-scattering-3.txt 2.txt > compton-scattering-3.html
	cat 1.txt compton-scattering-4.txt 2.txt > compton-scattering-4.html
	cat 1.txt compton-scattering-5.txt 2.txt > compton-scattering-5.html
	cat 1.txt drawradialpdf.txt 2.txt > drawradialpdf.html
	cat 1.txt electron-spin-1.txt 2.txt > electron-spin-1.html
	cat 1.txt electron-spin-2.txt 2.txt > electron-spin-2.html
	cat 1.txt energymatrix.txt 2.txt > energymatrix.html
	cat 1.txt exchange-energy.txt 2.txt > exchange-energy.html
	cat 1.txt hatom.txt 2.txt > hatom.html
	cat 1.txt how-planck-calculated-h-and-k.txt 2.txt > how-planck-calculated-h-and-k.html
	cat 1.txt legendre.txt 2.txt > legendre.html
	cat 1.txt lincomb.txt 2.txt > lincomb.html
	cat 1.txt plancks-law.txt 2.txt > plancks-law.html
	cat 1.txt positionop1.txt 2.txt > positionop1.html
	cat 1.txt positionop2.txt 2.txt > positionop2.html
	cat 1.txt radialeigenfunc.txt 2.txt > radialeigenfunc.html
	cat 1.txt radialfuncnorm.txt 2.txt > radialfuncnorm.html
	cat 1.txt spharm.txt 2.txt > spharm.html
	cat 1.txt super.txt 2.txt > super.html
	cat 1.txt wavefuncop1.txt 2.txt > wavefuncop1.html
	cat 1.txt wavefuncop2.txt 2.txt > wavefuncop2.html
