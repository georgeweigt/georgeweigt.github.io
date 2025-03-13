#include <stdio.h>

int
main()
{
	double alpha = 7.2973525643e-3;
	double c = 299792458.0;
	double e = 1.602176634e-19;
	double Ry = 13.605693122990;
	double me = 9.1093837015e-31;
	double mp = 1.67262192369e-27;

	double mu = me * mp / (me + mp);

	double E = mu * alpha * alpha * c * c / e / 2.0;

	printf("%20.12f\n", E);
}
