#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>

int filter(const struct dirent *p);
void emit_file(char *);

int
main()
{
	int i, n;
	struct dirent **p;
	static char s[100];

	printf("\\documentclass[12pt]{article}\n");
	printf("\\usepackage[margin=2cm]{geometry}\n");
	printf("\\usepackage{amsmath}\n");
	printf("\\usepackage{amssymb}\n"); // mathbb
	printf("\\usepackage{mathrsfs}\n"); // mathscr
	printf("\\usepackage{slashed}\n");
	printf("\\usepackage{tikz}\n");
//	printf("\\usepackage{fancyvrb}\n");
//	printf("\\usepackage{verbatim}\n");
//	printf("\\usepackage{hyperref}\n");
	printf("\\usepackage{xcolor}\n");
	printf("\\begin{document}\n");

	n = scandir(".", &p, filter, alphasort);

	for (i = 0; i < n; i++)
		emit_file(p[i]->d_name);

	printf("\\end{document}\n");

	return 0;
}

int
filter(const struct dirent *p)
{
	int len = strlen(p->d_name);

	if (len > 4 && strcmp(p->d_name + len - 4, ".tex") == 0)
		return 1;
	else
		return 0;
}

void
emit_file(char *filename)
{
	FILE *f;
	static char s[1000];

	printf("%% %s\n", filename);

	f = fopen(filename, "r");

	if (f == NULL) {
		fprintf(stderr, "cannot open %s\n", filename);
		exit(1);
	}

	while (fgets(s, sizeof s, f)) {
		if (strncmp(s, "\\newcommand", 11) == 0)
			printf("%s", s);
		if (strcmp(s, "\\begin{document}\n") == 0)
			break;
	}

	while (fgets(s, sizeof s, f)) {
		if (strcmp(s, "\\maketitle\n") == 0)
			continue;
		if (strcmp(s, "\\tableofcontents\n") == 0)
			continue;
		if (strcmp(s, "\\newpage\n") == 0)
			continue;
		if (strcmp(s, "\\end{document}\n") == 0)
			break;
		printf("%s", s);
	}

	fclose(f);
}
